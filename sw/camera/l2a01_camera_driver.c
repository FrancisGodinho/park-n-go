#include <asm/io.h>
#include <asm/types.h>
#include <asm/uaccess.h>
#include <linux/device.h>
#include <linux/dma-mapping.h>
#include <linux/fs.h>
#include <linux/init.h>
#include <linux/kobject.h>
#include <linux/module.h>
#include <linux/slab.h>

#include "hps_0.h"
#include "l2a01.h"

// Module information
MODULE_AUTHOR("CPEN391 L2A01");
MODULE_DESCRIPTION("CAMERA");
MODULE_LICENSE("GPL");
MODULE_VERSION("0.1");

// Device driver variables
static int majorNumber;
static struct class *class = NULL;
static struct device *device_rgbg = NULL;

// Image writer variables (one for each image_writer)
// 0 is RGBGray, 1 is Gray and 2 is Bin (same as minor numbers)
static void *image_writer;
static int is_open;
static void *virtual_buff0;
static dma_addr_t physical_buff0;
static void *virtual_buff1;
static dma_addr_t physical_buff1;
static size_t image_memory_size;
static int32_t last_image_number;

// Function prototypes
static int camera_open(struct inode *, struct file *);
static int camera_release(struct inode *, struct file *);
static ssize_t camera_read(struct file *, char *, size_t, loff_t *);
int camera_capture_image(char *user_read_buffer);

static struct file_operations fops = {
    .open = camera_open,
    .read = camera_read,
    .release = camera_release,
};

static int image_height = DEFAULT_IMAGE_HEIGHT;
static int image_width = DEFAULT_IMAGE_WIDTH;
static int image_writer_mode = CONTINUOUS;

static struct kobject *l2a01_camera_kobj;

//------INIT AND EXIT FUNCTIONS-----//
static int __init camera_driver_init(void) {
  void *SDRAMC_virtual_address;

  printk(KERN_INFO DRIVER_NAME ": Init\n");
  // Dynamically allocate a major number for the device
  majorNumber = register_chrdev(0, DRIVER_NAME, &fops);
  if (majorNumber < 0) {
    printk(KERN_ALERT DRIVER_NAME ": Failed to register a major number\n");
    return 1;
  }
  // Register the device class
  class = class_create(THIS_MODULE, CLASS_NAME);
  if (IS_ERR(class)) {
    printk(KERN_ALERT DRIVER_NAME ": Failed to register device class\n");
    goto error_class_create;
  }
  // Register the RGBG device
  device_rgbg = device_create(class, NULL, MKDEV(majorNumber, MINOR_RGBG), NULL,
                              DEV_NAME_RGBG);
  if (IS_ERR(device_rgbg)) {
    printk(KERN_ALERT DRIVER_NAME ": Failed to create the device RGBG\n");
    goto error_create_rgbg;
  }

  // kernel_kobj points to /sys/kernel
  l2a01_camera_kobj = kobject_create_and_add(DRIVER_NAME, kernel_kobj->parent);
  if (!l2a01_camera_kobj) {
    printk(KERN_INFO DRIVER_NAME ": Failed to create kobject mapping\n");
    goto error_create_kobj;
  }

  // Reset the variables that flag if a device is already Open
  is_open = 0;

  // Remove FPGA-to-SDRAMC ports from reset so FPGA can access SDRAM from them
  SDRAMC_virtual_address = ioremap(SDRAMC_REGS, SDRAMC_REGS_SPAN);
  if (SDRAMC_virtual_address == NULL) {
    printk(KERN_INFO "DMA LKM: error doing SDRAMC ioremap\n");
    goto error_create_kobj;
  }
  *((unsigned int *)(SDRAMC_virtual_address + FPGAPORTRST)) = 0xFFFF;

  return 0;

  // Undo what it was done in case of error
error_create_kobj:
  device_destroy(class, MKDEV(majorNumber, MINOR_RGBG));
error_create_rgbg:
  class_unregister(class);
  class_destroy(class);
error_class_create:
  unregister_chrdev(majorNumber, DRIVER_NAME);
  return -1;
}

static void __exit camera_driver_exit(void) {
  device_destroy(class, MKDEV(majorNumber, MINOR_RGBG));
  class_unregister(class);
  class_destroy(class);
  unregister_chrdev(majorNumber, DRIVER_NAME);
  kobject_put(l2a01_camera_kobj);
  printk(KERN_INFO DRIVER_NAME ": Exit\n");
}

int camera_get_image(int n, char *user_read_buffer, size_t len) {
  int error;
  int last_buffer;
  void *address_virtual_buffer;

  while (ioread32(image_writer + CAPTURE_IMAGE_COUNTER) == last_image_number) {
  };

  last_image_number = ioread32(image_writer + CAPTURE_IMAGE_COUNTER);

  // Capture already started so just check where the last image was saved
  last_buffer = ioread32(image_writer + LAST_BUFFER_CAPTURED);
  if (last_buffer == 0)
    address_virtual_buffer = virtual_buff0;
  else
    address_virtual_buffer = virtual_buff1;

  // Copy the image from buffer camera buffer to user buffer
  error = copy_to_user(user_read_buffer, address_virtual_buffer, len);

  if (error != 0) {
    printk(KERN_INFO DRIVER_NAME
           ": Failed to send %d characters to the user in read function\n",
           error);
    return -EFAULT; // Failed -- return a bad address message (i.e. -14)
  }
  return 0;
}

//-----CHAR DEVICE DRIVER SPECIFIC FUNCTIONS-----//
static int camera_open(struct inode *inodep, struct file *filep) {
  int image_writer_base;
  int image_writer_span;
  int pixel_size;
  int counter;

  // Findout which device is being open using the minor numbers
  int dev_number = iminor(filep->f_path.dentry->d_inode);

  // Establish image_writer and pixel_size based on image_type
  if (dev_number == MINOR_RGBG) {
    printk(KERN_INFO DRIVER_NAME ": Open RGBG\n");
    image_writer_base = AVALON_IMG_WRITER_RGBGRAY_BASE;
    image_writer_span = AVALON_IMG_WRITER_RGBGRAY_SPAN;
    pixel_size = sizeof(u8) * 4;
  } else {
    printk(KERN_INFO DRIVER_NAME ": Some error with the minor numbers!!\n");
    return -1;
  }

  if (is_open == 1) {
    printk(KERN_INFO DRIVER_NAME ": This device is already open!!\n");
    return -1;
  }

  // Ioremap FPGA memory //
  // To ioremap the slave port of the image writer in the FPGA so we can access
  // from kernel space
  image_writer =
      ioremap(HPS_FPGA_BRIDGE_BASE + image_writer_base, image_writer_span);
  if (image_writer == NULL) {
    printk(KERN_INFO DRIVER_NAME ": Error doing FPGA camera ioremap\n");
    return -1;
  }

  // Calculate required memory to store an Image
  image_memory_size = image_width * image_height * pixel_size;

  virtual_buff0 = dma_alloc_coherent(
      NULL, image_memory_size,
      &(physical_buff0), // address to use from image writer in fpga
      GFP_KERNEL);

  if (virtual_buff0 == NULL) {
    printk(KERN_INFO DRIVER_NAME
           ": Allocation of non-cached buffer 0 failed\n");
    return -1;
  }

  virtual_buff1 = dma_alloc_coherent(
      NULL, image_memory_size,
      &(physical_buff1), // address to use from image writer in fpga
      GFP_KERNEL);

  if (virtual_buff1 == NULL) {
    printk(KERN_INFO DRIVER_NAME
           ": Allocation of non-cached buffer 1 failed\n");
    return -1;
  }

  iowrite32(image_writer_mode, image_writer + CAPTURE_MODE);

  iowrite32(physical_buff0, image_writer + CAPTURE_BUFF0);
  iowrite32(physical_buff1, image_writer + CAPTURE_BUFF1);

  iowrite32(0, image_writer + CAPTURE_BUFFER_SELECT);

  iowrite32(1, image_writer + CONT_DOUBLE_BUFF);

  iowrite32(1, image_writer + CAPTURE_DOWNSAMPLING);

  iowrite32(0, image_writer + START_CAPTURE);

  counter = 10000000;
  while ((!(ioread32(image_writer + CAPTURE_STANDBY))) && (counter > 0)) {
    counter--;
  }
  if (counter == 0) {
    printk(KERN_INFO DRIVER_NAME ": Camera no reply\n");
    return ERROR_CAMERA_NO_REPLY;
  }

  // Start the capture
  iowrite32(1, image_writer + START_CAPTURE);

  is_open = 1;
  last_image_number = 0;

  return 0;
}

static ssize_t camera_read(struct file *filep, char *buffer, size_t len,
                           loff_t *offset) {
  int error;

  int dev_number = iminor(filep->f_path.dentry->d_inode);

  if (is_open == 0) {
    printk(KERN_INFO DRIVER_NAME ": This device is not open!!\n");
    return -1;
  }

  error = camera_get_image(dev_number, buffer, len);
  if (error != 0) {
    printk(KERN_INFO DRIVER_NAME ": Read failure\n");
    return -1;
  }
  return image_memory_size;
}

static int camera_release(struct inode *inodep, struct file *filep) {

  int dev_number = iminor(filep->f_path.dentry->d_inode);

  if (dev_number == MINOR_RGBG) {
    printk(KERN_INFO DRIVER_NAME ": Release RGBG\n");
  }

  if (is_open == 0) {
    printk(KERN_INFO DRIVER_NAME
           ": Error releasing: this device is not open!!\n");
    return -1;
  }

  // Set start to 0
  iowrite32(0, image_writer + START_CAPTURE);

  dma_free_coherent(NULL, image_memory_size, virtual_buff0, physical_buff0);
  dma_free_coherent(NULL, image_memory_size, virtual_buff1, physical_buff1);
  iounmap(image_writer);

  is_open = 0;

  return 0;
}

module_init(camera_driver_init);
module_exit(camera_driver_exit);

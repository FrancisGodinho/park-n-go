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
MODULE_DESCRIPTION("ACCELERATOR");
MODULE_LICENSE("GPL");
MODULE_VERSION("0.1");

// Device driver variables
static int majorNumber;
static struct class *class = NULL;
static struct device *device_rgbg = NULL;

static void *accel_writer;
static int is_open;
static void *virtual_buff0;
static dma_addr_t physical_buff0;
static void *virtual_buff1;
static dma_addr_t physical_buff1;
static size_t accel_memory_size;
static int32_t last_accel_number;

// Function prototypes
static int accel_open(struct inode *, struct file *);
static int accel_release(struct inode *, struct file *);
static ssize_t accel_read(struct file *, char *, size_t, loff_t *);
static ssize_t accel_write(struct file *, const char *, size_t, loff_t *);

static struct file_operations fops = {
    .open = accel_open,
    .read = accel_read,
    .write = accel_write,
    .release = accel_release,
};

static struct kobject *l2a01_accel_kobj;

//------INIT AND EXIT FUNCTIONS-----//
static int __init accel_driver_init(void) {
  void *SDRAMC_virtual_address;

  // printk(KERN_INFO DRIVER_NAME": Init\n");
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

  // Export sysfs variables
  // kernel_kobj points to /sys/kernel
  l2a01_accel_kobj = kobject_create_and_add(DRIVER_NAME, kernel_kobj->parent);
  if (!l2a01_accel_kobj) {
    printk(KERN_INFO DRIVER_NAME ": Failed to create kobject mapping\n");
    goto error_create_kobj;
  }

  // Reset the variables that flag if a device is already Open
  is_open = 0;

  SDRAMC_virtual_address = ioremap(SDRAMC_REGS, SDRAMC_REGS_SPAN);
  if (SDRAMC_virtual_address == NULL) {
    printk(KERN_INFO "DMA LKM: error doing SDRAMC ioremap\n");
    goto error_create_kobj;
  }
  *((unsigned int *)(SDRAMC_virtual_address + FPGAPORTRST)) = 0xFFFF;

  accel_memory_size = 64;

  virtual_buff0 = dma_alloc_coherent(
      NULL, accel_memory_size,
      &(physical_buff0), // address to use from accel writer in fpga
      GFP_KERNEL);

  if (virtual_buff0 == NULL) {
    printk(KERN_INFO DRIVER_NAME
           ": Allocation of non-cached buffer 0 failed\n");
    return -1;
  }

  virtual_buff1 = dma_alloc_coherent(
      NULL, accel_memory_size,
      &(physical_buff1), // address to use from accel writer in fpga
      GFP_KERNEL);

  if (virtual_buff1 == NULL) {
    printk(KERN_INFO DRIVER_NAME
           ": Allocation of non-cached buffer 1 failed\n");
    return -1;
  }

  int accel_writer_base;
  int accel_writer_span;
  accel_writer_base = AVALON_ACCEL_BASE;
  accel_writer_span = AVALON_ACCEL_SPAN;
  // Ioremap FPGA memory //
  // To ioremap the slave port of the accel writer in the FPGA so we can access
  // from kernel space
  accel_writer =
      ioremap(HPS_FPGA_BRIDGE_BASE + accel_writer_base, accel_writer_span);
  if (accel_writer == NULL) {
    printk(KERN_INFO DRIVER_NAME ": Error doing FPGA accel ioremap\n");
    return -1;
  }

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

static void __exit accel_driver_exit(void) {
  printk("Exiting accel module\n");
  dma_free_coherent(NULL, accel_memory_size, virtual_buff0, physical_buff0);
  dma_free_coherent(NULL, accel_memory_size, virtual_buff1, physical_buff1);
  iounmap(accel_writer);

  device_destroy(class, MKDEV(majorNumber, MINOR_RGBG));
  class_unregister(class);
  class_destroy(class);
  unregister_chrdev(majorNumber, DRIVER_NAME);
  kobject_put(l2a01_accel_kobj);
}

//-----CHAR DEVICE DRIVER SPECIFIC FUNCTIONS-----//
static int accel_open(struct inode *inodep, struct file *filep) {
  printk("We are in opening accel\n");
  int counter;
  int dev_number = iminor(filep->f_path.dentry->d_inode);

  is_open = 1;
  return 0;
}

static ssize_t accel_write(struct file *filep, const char *buffer, size_t len,
                           loff_t *offset) {
  unsigned long ret = copy_from_user(virtual_buff0, buffer, len / 2);
  if (ret != 0) {
    printk("UHOH1\n");
  }
  ret = copy_from_user(virtual_buff1, buffer + len / 2, len / 2);
  if (ret != 0) {
    printk("UHOH2\n");
  }
  return len;
}

static ssize_t accel_read(struct file *filep, char *buffer, size_t len,
                          loff_t *offset) {
  unsigned int res;
  iowrite32(physical_buff0, accel_writer + ACCEL_ADDR0);
  iowrite32(physical_buff1, accel_writer + ACCEL_ADDR1);
  iowrite32(25, accel_writer + ACCEL_N);
  res = ioread32(accel_writer + ACCEL_SUM);

  buffer[0] = (res & 0xFF);
  buffer[1] = (res & 0xFF00) >> 8;
  buffer[2] = (res & 0xFF0000) >> 26;
  buffer[3] = (res & 0xFF000000) >> 24;
  return len;
}

static int accel_release(struct inode *inodep, struct file *filep) {

  int dev_number = iminor(filep->f_path.dentry->d_inode);

  if (dev_number == MINOR_RGBG) {
    printk(KERN_INFO DRIVER_NAME ": Release ACCEL\n");
  }

  is_open = 0;

  return 0;
}

module_init(accel_driver_init);
module_exit(accel_driver_exit);

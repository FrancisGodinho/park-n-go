#ifndef CPEN391_L2A01_H
#define CPEN391_L2A01_H

#define ACCEL_START 0x0
#define ACCEL_ADDR0 0x4
#define ACCEL_ADDR1 0x8

#define HPS_FPGA_BRIDGE_BASE 0xC0000000
#define DRIVER_NAME "cpen391_accel"
#define CLASS_NAME "cpen391_accel"
#define DEV_NAME_RGBG "cpen391_accel_erator"
#define MINOR_RGBG 0
#define CONTINUOUS  1

#define SDRAMC_REGS 0xFFC20000
#define SDRAMC_REGS_SPAN 0x20000 //128kB
#define FPGAPORTRST 0x5080

#endif //CPEN391_L2A01_H

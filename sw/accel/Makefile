#ng this makefile export the location of you SDK,
#obtained from OS compilation (export SDKROOT = <path to sdk root>)

obj-m += l2a01_accel_driver.o

SRC := $(shell pwd)

KDIR := /lib/modules/3.13.0-00299-ga2e769f/build/
ARCH := arm
EXTRA_CFLAGS += -I$(PWD)/include/ #path to the .h files

all: 
	make -C $(KDIR) M=$(SRC) ARCH=$(ARCH)  modules

clean: 
	make -C $(KDIR) M=$(SRC) ARCH=$(ARCH)  clean

accel: 
	g++ accel.cpp sw_test.cpp -o sw_test -std=c++11

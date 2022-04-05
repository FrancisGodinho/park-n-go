obj-m += read_write.o

PWD := $(CURDIR)

all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

test:
	g++ rw_test.cpp -o rw_test -std=c++11

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean

test: 
	g++ t1.cpp t2.cpp -o out
all: 
	g++ client.cpp ../accel/accel.cpp -o client -std=c++11
kernel_accel:
	cd ../accel && ../accel/register
kernel_camera:
	cd ../camera && ../camera/register
test:
	g++ client_tests.cpp -o tests -std=c++11


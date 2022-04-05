test: 
	g++ t1.cpp t2.cpp -o out
all: 
	g++ client.cpp ../accel/accel.cpp -o client -std=c++11
kernel_accel:
	cd ../accel && ../accel/register
kernel_camera:
	cd ../camera && ../camera/register
parse_response:
	g++ parse_response_test.cpp -o parse_test -std=c++11
form_reply:
	g++ form_reply_test.cpp -o form_test -std=c++11
clean:
	rm -rf *.swp* *.o parse_test form_test client

#include <iostream>
#include <fstream>
#include <string> 
#include <vector>

using namespace std;
int main() {
	fstream rw;
	fstream rw_write;
	rw.open("/dev/chardev", ios::binary | ios::in);
	rw_write.open("/dev/chardev", ios::binary | ios::out);

	char buf[10000] = {0};
	for (int i = 0; i < 100; i++) {

		rw.read(buf, 9000);
		
		rw_write.write(buf, 100);
		rw_write.flush();
	
	}

	return 0;
}

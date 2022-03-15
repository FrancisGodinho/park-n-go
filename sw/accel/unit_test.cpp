#include <iostream>
#include <fstream>
#include <string> 

using namespace std;

int main () {
    fstream accel;
    char res[32];   
    char write_buff[32];   
    write_buff[0];
    accel.open("/dev/cpen391_accel_erator", ios::binary | ios::in | ios::out);
       
    accel.write(write_buff, 1);
    accel.read(res, 1);
    //cout << res << endl;
    for (int i = 0; i < 4; i++) {
       cout << (int)res[i] << ' ';
    }
    cout << endl;
    accel.close();
    return 0;
}



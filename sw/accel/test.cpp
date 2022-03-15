#include <iostream>
#include <fstream>
#include <string> 

using namespace std;

int main () {
    fstream accel;
    cout << "hello\n" << endl;
    char res[4] = {0};   
    char write_buff[32];   
    write_buff[0] = 39;
    write_buff[1] = 2;
    write_buff[2] = 3;
    write_buff[3] = 4;
    write_buff[4] = 5;
    write_buff[5] = 6;
    write_buff[6] = 7;
    write_buff[7] = 8;
    write_buff[8] = 9;
    write_buff[9] = 10;
    write_buff[10] = 11;
    write_buff[11] = 12;
    write_buff[12] = 13;
     accel.open("/dev/cpen391_accel_erator", ios::binary | ios::in | ios::out);
        
     accel.write(write_buff, 12);
     accel.read(res, 4);
     //cout << res << endl;
     for (int i = 0; i < 4; i++) {
        cout << (int)res[i] << ' ';
     }
     cout << endl;
     accel.close();
     return 0;
}


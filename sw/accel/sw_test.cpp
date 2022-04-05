#include <iostream>
#include <fstream>

#include "./accel.h"

using namespace std;

int main(){

    cout << "Running accel tests!" << endl;
    int res; 

    res = test();
    if(res != 0){
        cout << "Test 1 failed!" << endl;
    }

    res = test2();
    if(res != 0){
        cout << "Test 2 failed!" << endl;
    }

    res = test3();
    if(res != 0){
        cout << "Test 3 failed!" << endl;
    }

    res = test4();
    if(res != 0){
        cout << "Test 4 failed!" << endl;
    }

    return 0;
}
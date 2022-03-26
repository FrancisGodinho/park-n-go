#ifndef ACCEL_H
#define ACCEL_H

#include <iostream>
#include <fstream>
#include <string> 
#include <vector>

//#define DEBUG_PRINT
//#define PRINT_BLUR_RESULT

using namespace std;

// set constants
const int img_height = 225;//TODO: Change these!
const int img_width = 300;
const int win_len = 5;
const int real_image_height = 480;	
const int real_image_width = 640;	
const int pixels = 4;	

int setup_arr(vector<int>& a1, int* a2, char* o, int n);
void g_blur(vector<vector<int>>& img, vector<vector<int>>& out, vector<int> win);
int test ();

#endif // ACCEL_H

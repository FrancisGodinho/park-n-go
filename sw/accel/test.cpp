#include <iostream>
#include <fstream>
#include <string> 
#include <vector>

//#define DEBUG_PRINT
#define PRINT_BLUR_RESULT
using namespace std;
	
// set constants
const int img_height = 3;
const int img_width = 4;
const int win_len = 2;

static int setup_arr(int* a1, int* a2, char* o, int n) {
	// expands, and concateates a1 and a2
	// expanding: [1, 2, 3] -> [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]
    int i;
    for (i = 0; i < n * 4; i++) {
 	if (i % 4 == 0) {
           o[i] = a1[i/4];
	}
        else {
           o[i] = 0;
        }
    }
    for (i = n * 4; i < n * 2 * 4; i++) {
 	if (i % 4 == 0) {
           o[i] = a2[(i-n*4)/4];
	}
        else {
           o[i] = 0;
        }
    }
     
    return 0;
}

static void g_blur(int (*img)[img_width], int (*out)[img_width - win_len + 1], int* win){	
	int i, j;
	int p, q;
	char res[4];
	int curr_img[win_len * win_len];
	curr_img[0] = img[0][0];
	for(i = 0; i < img_height - win_len + 1; i++){
		for(j = 0; j < img_width - win_len + 1; j++){
			// flatten the array
			for(p = i; p < i + win_len; p++){
				for(q = j; q < j + win_len; q++){
					curr_img[(p - i)*win_len + (q - j)] = img[p][q];
				}
			}
    		fstream accel;
			// open the kernel module
    		accel.open("/dev/cpen391_accel_erator", ios::binary | ios::in | ios::out);
			char o[8 * win_len * win_len]; // array to write to 1gb dram
    		setup_arr(win, curr_img, o, win_len * win_len); // create o
#ifdef DEBUG_PRINT
			cout << "printing curr_img " << endl;
			for(p = 0; p < win_len * win_len; p++){
				cout << (int) curr_img[p] << ", ";
			} cout << endl;
			cout << "printing window " << endl;
			for(p = 0; p < win_len * win_len; p++){
				cout << (int) win[p] << ", ";
			} cout << endl;
			cout << "printing o " << endl;
			for(p = 0; p < 8 * win_len * win_len; p++){
				cout << (int) o[p] << ", ";
			} cout << endl;
#endif
			accel.write(o, 8 * win_len * win_len); // write to 1gb dram
     		accel.read(res, win_len); // read result of hw accleration

			out[i][j] = res[0]; // write the result to out array
     		accel.close(); // close the kernel module
		}
	}
}


int main () {
    fstream accel;

	// test blur
	int img[img_height][img_width] = {{1, 2, 3, 5}, {4, 5, 6, 10}, {7, 8, 9, 15}};
	int window[win_len * win_len] = {1, 2, 3, 4};
	int out[img_height - win_len + 1][img_width - win_len + 1];
	g_blur(img, out, window);

#if defined(DEBUG_PRINT) || defined(PRINT_BLUR_RESULT)
	int p, q;
	cout << "Result of blur is " << endl;
	for(p = 0; p < img_height - win_len + 1; p++){
		for(q = 0; q < img_width - win_len + 1; q++)
			cout << out[p][q] << ", ";
		cout << endl;
	}	
#endif
    return 0;
}


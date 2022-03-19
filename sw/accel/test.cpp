#include <iostream>
#include <fstream>
#include <string> 
#include <vector>

#define WIN_LEN 4
using namespace std;

static int setup_arr(int* a1, int* a2, char* o, int n) {
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

static void g_blur(int (*img)[3], int (*out)[2], int w, int h, int w_len, int* win){	
	int i, j;
	int p, q;
	int res;
	int curr_img[w_len * w_len];
	curr_img[0] = img[0][0];
	for(i = 0; i < w - w_len + 1; i++){
		for(j = 0; j < h - w_len + 1; j++){
			// flatten the array
			for(p = i; p < i + w_len; p++){
				for(q = j; q < j + w_len; q++){
					curr_img[(p - i)*w_len + (q - j)] = img[p][q];
				}
			}
			// pass to accelerator TODO:
			res = 0;
			for(p = 0; p < w_len * w_len; p++){
				res += curr_img[p] * win[p];
			}

			// write the result to out
			out[i][j] = res;
		}
	}
}


int main () {
    fstream accel;
    cout << "hello\n" << endl;

	// test blur
	int img[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
	int window[4] = {1, 2, 3, 4};
	int out[2][2];
	g_blur(img, out, 3, 3, 2,(int*) window);
	int p, q;
	cout << "Result of blur is " << endl;
	for(p = 0; p < 2; p++){
		for(q = 0; q < 2; q++){
			cout << out[p][q] << ", ";
		}	
		cout << endl;
	}	
		
    char res[4] = {0};   
    char write_buff[32];   
    char i; 
    int a1[4] = {30, 5, 0, 21};
    int a2[4] = {8, 9, 5, 6};
    char o[8 * 4];

    setup_arr(a1, a2, o, 4);
    
    for (i = 0; i < 24; i++) {
        if (i % 4 == 0) {
           *(write_buff+i) = 3;
        }
        else {
           *(write_buff+i) = 0;
        }
    }

    accel.open("/dev/cpen391_accel_erator", ios::binary | ios::in | ios::out);
        
     accel.write(o, 8 * 4);
     accel.read(res, 4);
     //cout << res << endl;
     for (int i = 0; i < 4; i++) {
        cout << (int)res[i] << ' ';
     }
     cout << endl;
     accel.close();
     return 0;
}


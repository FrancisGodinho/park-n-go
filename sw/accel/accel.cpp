#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "./accel.h"

using namespace std;

int setup_arr(vector<int> &a1, int *a2, char *o, int n) {
  // expands, and concateates a1 and a2
  // expanding: [1, 2, 3] -> [1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]
  int i;
  for (i = 0; i < n * 4; i += 4) {
    o[i] = a1[i / 4];
  }
  for (i = n * 4; i < n * 2 * 4; i += 4) {
    o[i] = a2[(i - n * 4) / 4];
  }

  return 0;
}

void g_blur(vector<vector<int>> &img, vector<vector<int>> &out,
            vector<int> win) {
  int i, j;
  int p, q;
  char res[32];
  int curr_img[win_len * win_len];
  // cout << img.size() << endl;
  // cout << img[0].size() << endl;
  curr_img[0] = img[0][0];
  fstream accel;
  fstream accel_write;
  // open the kernel module
  accel.open("/dev/cpen391_accel_erator", ios::binary | ios::in | ios::out);
  accel_write.open("/dev/cpen391_accel_erator",
                   ios::binary | ios::in | ios::out);
  for (i = 0; i < img_height - win_len + 1; i++) {
    for (j = 0; j < img_width - win_len + 1; j++) {
      // flatten the array
      for (p = i; p < i + win_len; p++) {
        for (q = j; q < j + win_len; q++) {
          curr_img[(p - i) * win_len + (q - j)] = img[p][q];
        }
      }
      char o[8 * win_len * win_len] = {0}; // array to write to 1gb dram
      setup_arr(win, curr_img, o, win_len * win_len); // create o
#ifdef DEBUG_PRINT
      cout << "printing curr_img " << endl;
      for (p = 0; p < win_len * win_len; p++) {
        cout << (int)curr_img[p] << ", ";
      }
      cout << endl;
      cout << "printing window " << endl;
      for (p = 0; p < win_len * win_len; p++) {
        cout << (int)win[p] << ", ";
      }
      cout << endl;
      cout << "printing o " << endl;
      for (p = 0; p < 8 * win_len * win_len; p++) {
        cout << (int)o[p] << ", ";
      }
      cout << endl;
#endif
      accel_write.write(o, 8 * win_len * win_len); // write to 1gb dram
      accel_write.flush();
      // accel.write(o, 8 * win_len * win_len); // write to 1gb dram
      accel.read(o, 9000); // read result of hw accleration
#ifdef DEBUG_PRINT
      cout << "result of dot product is " << (int)o[0] << endl;
#endif
      out[i][j] = o[0] | (o[1] << 8) | (o[2] << 16) |
                  (o[3] << 24); // write the result to out array
    }
  }
  accel.close();       // close the kernel module
  accel_write.close(); // close the kernel module
}

int test() {
  fstream accel;

  // test blur
  vector<vector<int>> img = {{1, 2, 3, 5}, {4, 5, 6, 10}, {7, 8, 9, 15}};
  vector<int> window = {1, 2, 3, 4};
  vector<vector<int>> out(img_height - win_len + 1,
                          vector<int>(img_width - win_len + 1));
  g_blur(img, out, window);

#if defined(DEBUG_PRINT) || defined(PRINT_BLUR_RESULT)
  int p, q;
  cout << "Result of blur is " << endl;
  for (p = 0; p < img_height - win_len + 1; p++) {
    for (q = 0; q < img_width - win_len + 1; q++)
      cout << out[p][q] << ", ";
    cout << endl;
  }
#endif
  return 0;
}

int test2() {
  /* size 3x3 window test with 0's and 255 */
  fstream accel;

  // test blur
  vector<vector<int>> img = {{5, 3, 2, 1}, {10, 6, 5, 4}, {15, 9, 8, 7}};
  vector<int> window = {
      1, 2, 3, 4, 0, 0, 255, 128, 0}; // change win_len to 9 when running test
  vector<vector<int>> out(img_height - win_len + 1,
                          vector<int>(img_width - win_len + 1));
  g_blur(img, out, window);

#if defined(DEBUG_PRINT) || defined(PRINT_BLUR_RESULT)
  int p, q;
  cout << "Result of blur is " << endl;
  for (p = 0; p < img_height - win_len + 1; p++) {
    for (q = 0; q < img_width - win_len + 1; q++)
      cout << out[p][q] << ", ";
    cout << endl;
  }
#endif
  return 0;
}

int test3() {
  /* Size 3x3 windows with all 0's */
  fstream accel;

  // test blur
  vector<vector<int>> img = {{5, 3, 2, 1}, {10, 6, 5, 4}, {15, 9, 8, 7}};
  vector<int> window = {0, 0, 0, 0, 0,
                        0, 0, 0, 0}; // change win_len to 9 when running test
  vector<vector<int>> out(img_height - win_len + 1,
                          vector<int>(img_width - win_len + 1));
  g_blur(img, out, window);

#if defined(DEBUG_PRINT) || defined(PRINT_BLUR_RESULT)
  int p, q;
  cout << "Result of blur is " << endl;
  for (p = 0; p < img_height - win_len + 1; p++) {
    for (q = 0; q < img_width - win_len + 1; q++)
      cout << out[p][q] << ", ";
    cout << endl;
  }
#endif
  return 0;
}

int test4() {
  /* Size 4x4 windows with all 255's */
  fstream accel;

  // test blur
  vector<vector<int>> img = {
      {5, 3, 2, 1, 0}, {10, 6, 5, 4, 2}, {15, 9, 8, 7, 4}};
  vector<int> window = {255, 255, 255, 255, 255, 255, 255, 255,
                        255, 255, 255, 255, 255, 255, 255, 255};
  vector<vector<int>> out(img_height - win_len + 1,
                          vector<int>(img_width - win_len + 1));
  g_blur(img, out, window);

#if defined(DEBUG_PRINT) || defined(PRINT_BLUR_RESULT)
  int p, q;
  cout << "Result of blur is " << endl;
  for (p = 0; p < img_height - win_len + 1; p++) {
    for (q = 0; q < img_width - win_len + 1; q++)
      cout << out[p][q] << ", ";
    cout << endl;
  }
#endif
  return 0;
}
#include "./utils.h"

static int form_reply_tests() {
  ofstream f;
  vector<vector<int>> test_vec;

  // normal test
  f.open("form_reply_test1.txt");
  test_vec = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
  form_reply(test_vec, f);
  f.close();
  system("cat form_reply_test1.txt");
  cout << endl;

  // large numbers and zeros
  f.open("form_reply_test2.txt");
  test_vec = {{103, 3422, 5435}, {754, 0, 2}, {0, 0, 1}};
  form_reply(test_vec, f);
  f.close();
  system("cat form_reply_test2.txt");
  cout << endl;

  // larger vector
  f.open("form_reply_test3.txt");
  test_vec = {
      {103, 3422, 5435, 234}, {754, 0, 2, 0}, {0, 0, 1, 2}, {12, 3, 45, 6}};
  form_reply(test_vec, f);
  f.close();
  system("cat form_reply_test3.txt");
  cout << endl;

  f.open("form_reply_test4.txt");
  test_vec = {{103, 3422, 5435, 234}, {754, 0, 2, 0}};
  form_reply(test_vec, f);
  f.close();
  system("cat form_reply_test4.txt");
  cout << endl;

  return 0;
}

int main() {

  cout << "----- Running Form Reply Tests -----" << endl;
  if (form_reply_tests()) {
    cout << "Form Reply Tests Failed!" << endl;
    return 1;
  }

  cout << endl;
  cout << "\033[0;32mFinished all Tests!\033[0m" << endl;
  return 0;
}
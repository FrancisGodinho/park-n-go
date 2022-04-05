#ifndef UTILS_H
#define UTILS_H

#include <fstream>
#include <iostream>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <vector>

using namespace std;

void parse_response(string &in, vector<vector<int>> &res) {
  vector<int> curr;
  int curr_digit = 0;
  for (int i = 0; i < in.size(); i++) {
    if (in[i] == ',' && in[i - 1] == ']' && i > 0)
      continue;
    if (in[i] == '[' || in[i] == ' ')
      continue;
    if (in[i] == ',') {
      curr.push_back(curr_digit);
      curr_digit = 0;
      continue;
    } else if (in[i] == ']' && i != in.size() - 1) {
      curr.push_back(curr_digit);
      curr_digit = 0;
      res.push_back(curr);
      curr = vector<int>();
      continue;
    }
    curr_digit *= 10;
    curr_digit += in[i] - '0';
  }
}

void form_reply(vector<vector<int>> &in, ofstream &f) {
  f << ("[");
  for (int i = 0; i < in.size(); i++) {
    string curr = "[";
    for (int j = 0; j < in[i].size(); j++) {
      curr += to_string(in[i][j]);
      if (j < in[i].size() - 1)
        curr += ",";
    }
    if (i < in.size() - 1)
      curr += "],";
    else
      curr += "]";
    f << (curr);
  }
  f << ("]");
}

#endif // UTILS_H
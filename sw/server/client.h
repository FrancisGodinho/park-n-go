#ifndef CLIENT_H
#define CLIENT_H

#include <iostream>
#include <stdlib.h> 
#include <stdio.h> 
#include <fstream>
#include <string> 
#include <stdint.h>

#include "../accel/accel.h"

using namespace std;

void form_reply(vector<vector<int>>& in, ofstream& f);
void parse_response(string& in, vector<vector<int>>& res);

#endif // CLIENT_H
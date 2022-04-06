#include <iostream>
#include <stdlib.h> 
#include <stdio.h> 
#include <fstream>
#include <string> 
#include <stdint.h>

#include "../accel/accel.h"
#include "./exec.h"


static void parse_response(string& in, vector<vector<int>>& res){
	vector<int> curr;
	int curr_digit = 0;
	for(int i = 0; i < in.size(); i++){
		if(in[i] == ',' && in[i - 1] == ']' && i > 0) continue;
		if(in[i] == '[' || in[i] == ' ') continue;
		if(in[i] == ',' ){
			curr.push_back(curr_digit);
			curr_digit = 0;
			continue;
		}
		else if(in[i] == ']' && curr.size() > 0) {
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

static void form_reply(vector<vector<int>>& in, ofstream& f){
	f << ("[");
	for(int i = 0; i < in.size(); i++){
		string curr = "[";
		for(int j = 0; j < in[i].size(); j++){
			curr += to_string(in[i][j]);
			if(j < in[i].size() - 1)
				curr += ",";
		}
		if(i < in.size() - 1)
			curr += "],";
		else
			curr += "]";
		f << (curr);
	}
	f << ("]");
}

int main(){
    ifstream camera;
    camera.open("/dev/cpen391_camera_rgbg", std::ios::binary);
	bool second = false;
	for(volatile int i = 0; i < 1e7; i++); // some delay
	vector<int> window = {
		1,4,7,4,1,
		4,16,26,16,4,
		7,26,41,26,7,
		4,16,26,16,4,
		1,4,7,4,1};
	
	while(1){
    	uint32_t image_size = real_image_height * real_image_width * pixels;
    	string result(image_size, '\0');
    	camera.read(&result[0], image_size);
		// create new file
		ofstream myfile;
 		myfile.open ("image");
 		myfile << result;
 		myfile.close();

		// make curl request 
		system("curl -L -F 'file=@image' http://ec2-3-85-235-244.compute-1.amazonaws.com:8080/uploadfile > result");	
    	fstream response;
    	response.open("./result", ios::binary | ios::in | ios::out);
		string line;
		getline(response, line);
		vector<vector<int>> img;
		parse_response(line, img);
		
		//accleration
		vector<vector<int>> output(img_height - win_len + 1, vector<int>(img_width - win_len + 1));
		cout << "gigng to accel! " << endl;
		g_blur(img, output, window);

		cout << "Done accel!" << endl;
		
		ofstream repl;
 		repl.open ("reply");
		form_reply(output, repl);
 		repl.close();
		system("curl -L -F 'file=@reply' http://ec2-3-85-235-244.compute-1.amazonaws.com:8080/accel_result");	
	}
	
	return 0;
}


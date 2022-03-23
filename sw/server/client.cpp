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
	for(auto c : in){
		if(c == '[' || c == ' ' || c == ',') continue;
		else if(c == ']' && curr.size() > 0) {
			res.push_back(curr);
			curr = vector<int>();
			continue;
		}
		curr.push_back(c - '0');
	}
}

static void form_reply(vector<vector<int>>& in, string& res){
	res = "<";
	for(int i = 0; i < in.size(); i++){
		string curr = "<";
		for(int j = 0; j < in[i].size(); j++){
			curr += to_string(in[i][j]);
			if(j < in[i].size() - 1)
				curr += ",";
		}	
		curr += ">";
		res += curr;
	}
	res += ">";
}

int main(){
	
    ifstream camera;
    camera.open("/dev/cpen391_camera_rgbg", std::ios::binary);
	bool second = false;
	for(volatile int i = 0; i < 1e7; i++); // some delay

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
		//system("curl -L -F 'file=@image' http://ec2-54-172-213-79.compute-1.amazonaws.com:8080/uploadfile > result");	
    	//fstream response;
    	//response.open("./result", ios::binary | ios::in | ios::out);
		string line;
		//getline(response, line);
		//cout << line << endl;
		
		line = "[[1, 2, 3, 4], [4, 5, 6, 4], [7, 8, 9, 4]]";
		vector<vector<int>> img;
		parse_response(line, img);
		

		//acclerating	
		vector<int> window = {1, 1, 1, 1, 1, 1, 1, 1, 1};
		vector<vector<int>> output(img_height - win_len + 1, vector<int>(img_width - win_len + 1));
		g_blur(img, output, window);
		
		cout << "result in client.cpp is " << endl;
		for(auto& v : output){
			for(auto i : v) cout << i << ", ";
			cout << endl;
		}
		
		string res;	
		form_reply(output, res);
		cout << "formed reply is " << res << endl;
		string cmd = "curl -X 'POST' 'http://ec2-54-172-213-79.compute-1.amazonaws.com:8080/accel_result?input=" + res + "'";
		system(cmd.c_str());	
		break;
	}
	
	return 0;
}


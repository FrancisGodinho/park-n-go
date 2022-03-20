#include <iostream>
#include <stdlib.h> 
#include <stdio.h> 
#include <fstream>
#include <string> 
#include <stdint.h>

using namespace std;

const int image_height = 480;	
const int image_width = 640;	
const int pixels = 4;	
int main(){
	
    ifstream camera;
    camera.open("/dev/cpen391_camera_rgbg", std::ios::binary);

	for(volatile int i = 0; i < 1e6; i++); // some delay
	while(1){
    	uint32_t image_size = image_height * image_width * pixels;
    	std::string result(image_size, '\0');
    	camera.read(&result[0], image_size);

		// create new file
		ofstream myfile;
 		myfile.open ("image");
 		myfile << result;
 		myfile.close();

		system("curl -L -F 'file=@image' http://ec2-54-172-213-79.compute-1.amazonaws.com:8080/uploadfile ");	
	}
	
	return 0;
}


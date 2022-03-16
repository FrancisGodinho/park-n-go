import subprocess

# return a list of lists of integer of picture data
def curl_server_to_de1(curl_cmd):
    try: 
        status, output = subprocess.getstatusoutput(curl_cmd)
        data_list = []
        pic_data_str = output.split("\"response\":", 1)[1].strip("}")[1:-1] 
        # example pic_data_str this: [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1]]
        print(pic_data_str)  # for debugging 
        for str_index in range(0, len(pic_data_str)):
            for char_index in range(0, len(pic_data_str[str_index])):
                cur_char = pic_data_str[str_index][char_index]
                # add a new list
                if (cur_char == '['): 
                    data_list.append([])
                # add number to the last list
                elif (cur_char.isdigit()): 
                    data_list[-1].append(int(cur_char))               
    except (NameError, AttributeError) as e:
        print('Error: -------------------------')
    return data_list

# Note: using a local .png file for now
curl_cmd = 'curl -L -F \'file=@logo.png\' http://ec2-54-172-213-79.compute-1.amazonaws.com:8080/uploadfile'
result = curl_server_to_de1(curl_cmd=curl_cmd)
# print(result)  # for debugging
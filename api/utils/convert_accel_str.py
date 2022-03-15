import requests

def get_accel_str(img_url, img_obj):
    try: 
        resp = requests.post(url=img_url, params=img_obj).text
        # print(resp)   # for debugging
        data_list = []
        pic_data_list = resp.strip('{\"result\":}')[1:-1].split(r'[|]')
        # print(pic_data_list)  # for debugging 
        for str_index in range(0, len(pic_data_list)):
            for char_index in range(0, len(pic_data_list[str_index])):
                cur_char = pic_data_list[str_index][char_index]
                # add a new list
                if (cur_char == '['): 
                    data_list.append([])
                # add number to the last list
                elif (cur_char.isdigit()): 
                    data_list[-1].append(int(cur_char))               
    except (NameError, AttributeError) as e:
        print('Error: -------------------------')
    return data_list
# Convert picture to a strings
img_str = bytes('Hello_world', 'utf-8')
# Set up the url and key-value pair
img_url = 'http://ec2-54-172-213-79.compute-1.amazonaws.com:8080/server_to_de1'
img_obj = {'image': img_str}
# Get the result list
result = get_accel_str(img_url, img_obj)
# print(result)  # for debugging
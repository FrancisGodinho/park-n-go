# command to compile c code and create .so:
# cc -fPIC -shared -o hello_world.so hello_world.c
from ctypes import *
import ctypes
so_file = "./unit_test.so"
my_functions = CDLL(so_file)

input_len = 6
output_len = 6

print(type(my_functions))
# Define an array of length 4
intput_array = list(range(input_len))
print(intput_array)
IntArrayType = ctypes.c_int * input_len
param_array = IntArrayType(*intput_array)
my_functions.test.restype = ctypes.POINTER(ctypes.c_int * output_len)
print([i for i in my_functions.test(param_array).contents])

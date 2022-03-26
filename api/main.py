from itertools import product
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import os
import subprocess
from datetime import datetime
from typing import List

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import aiofiles
import imageio
import numpy as np

import sys
import cv2
import imutils
sys.path.append("..")
from alpr.alpr import ALPR
import pytesseract
import ast
from pydantic import BaseModel

from test import software_dot_product
import classes

app = FastAPI()
test_img = [[]]

# Firebase initialization
# Use the application default credentials
#project_id = ''
#cred = credentials.Certificate('./firebasePrivateKey.json')
#firebase_admin.initialize_app(cred)

#db = firestore.client()

# origins = [
#    "http://localhost",
#    "http://localhost:8000",
#    "http://localhost:8080",
#    "http://localhost:8081",
#    "http://localhost:19001"
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

alpr = ALPR(debug=False)

def string_to_numpy2(content):
    return 0

def string_to_numpy(str):
    #print(str)
    str = str.replace('<', '[').replace('>', ']')
    lst = ast.literal_eval(str)
    arr = np.array(lst, dtype='float64')
    return arr

@app.get("/test")
async def Test():
    return "testing value"

@app.post("/test_post")
async def TestPost(data: classes.Data):
    return f"testing value {data.val}"

@app.get("/test_param")
async def TestParam(val: str):
    return f"testing value {val}"

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    content = await file.read()  # async read
    #print(len(content))
    raw_array = np.fromstring(content, dtype=np.uint8)
    raw_array = raw_array.reshape((480, 640, 4))
    image = raw_array[:, :, 0:3]
    image += 10
    #print(image)
    imageio.imwrite("img.png", image)
    #return 0 #TODO: REMOVE
    image = cv2.imread('img.png')
    lpText = None
    image = imutils.resize(image, width=300)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    alpr.gray = gray
    res = alpr.get_gauss_image()
    # gauss
    image = cv2.GaussianBlur(res, (5, 5), 0)
    # gauss
    candidates = alpr.locate_license_plate_candidates(image)
    (lp, lpCnt) = alpr.locate_license_plate(candidates, clearBorder=False)
    # only OCR the license plate if the license plate ROI is not empty
    if lp is not None:
        # OCR the license plate
        # lp = imutils.resize(lp, width=3250)
        options = alpr.build_tesseract_options(psm=13)
        lpText = pytesseract.image_to_string(lp, config=options)
        print(f"software says: {lpText}")
        alpr.debug_imshow("License Plate", lp)
    if lpText is None or lpText == '':
        print("No Plate")
    # image = imutils.resize(image, width=250)
    # gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # alpr.gray = gray
    # res = alpr.get_gauss_image()
    res = res.tolist()
    #TODO: Remove
    #for p in range(5):
    #    for q in range(5):
    #        print(res[p][q], ", ")
    #    print()
    #test_img[0] = software_dot_product(res)
    return res

@app.post("/accel_result")
async def acceleration_result(file: UploadFile = File(...)):

    def comp(a, b):
        for x, y in zip(a, b):
            for i, j in zip(x, y):
                if i != j:
                    print(f"i is {i}, j is {j}")
                    return False;
        return True;
    lpText = None
    content = await file.read()
    #print(content)
    #print(type(content))
    image = str(content)[2:-1]
    print(f"return image is {image[0:5]}")
    #print(image[0])
    image =  string_to_numpy(image)
    if comp(image, test_img[0]):
        print("Hardware is verified!")
    else:
        print("Hardware error!")
        #print(test_img[0])
        #print(image[0])
    image /= 273
    image = image.astype('uint8')
    candidates = alpr.locate_license_plate_candidates(image)
    (lp, lpCnt) = alpr.locate_license_plate(candidates, clearBorder=False)
    # only OCR the license plate if the license plate ROI is not empty
    if lp is not None:
        # OCR the license plate
        options = alpr.build_tesseract_options(psm=13)
        lpText = pytesseract.image_to_string(lp, config=options)
        print(f"hardware says: {lpText}")
        alpr.debug_imshow("License Plate", lp)
    if lpText is None or lpText == '':
        print("No Plate")

@app.get("/view_image")
async def view_image():
    return FileResponse("./img.png")

@app.get("/view_image_date")
async def view_image(date: str):
    return FileResponse(f"../archives/img_{date}.png")

@app.post("/server_to_de1")
async def server_to_de1(image="hello"):
    print(image)
    return {"result":[[1, 2, 3, 4], [5, 6, 7, 8]]}

@app.get("/get_plate")
async def get_plate():
    #async with aiofiles.open(f"img.png", 'wb') as out_file:
    #    content = await file.read()  # async read
    #    await out_file.write(content)  # async write

    #lisence plate recognition
    alpr = ALPR()
    image = cv2.imread("img.png")
    image = imutils.resize(image, width=600)
    (lpText, lpCnt) = alpr.find_and_ocr(image)
    return lpText

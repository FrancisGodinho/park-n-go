from itertools import product
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
from typing import List

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import aiofiles

app = FastAPI()

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


@app.get("/test")
async def Test():
    return "testing value"

@app.post("/test_post")
async def TestPost(val: int = 0):
    return f"testing value {val}"

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    async with aiofiles.open("img.png", 'wb') as out_file:
        content = await file.read()  # async read
        await out_file.write(content)  # async write
    return {"filename": file.filename}

@app.get("/view_image")
async def view_image():
    return FileResponse("./img.png")

from itertools import product
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
from typing import List

app = FastAPI()

# Firebase initialization
# Use the application default credentials
project_id = ''
cred = credentials.Certificate('./firebasePrivateKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

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


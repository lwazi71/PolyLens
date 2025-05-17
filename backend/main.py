from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import openhands as OH

app = FastAPI()

class Landmarks(BaseModel):
    landmarks: list[list[float]]  # [[x,y,z],...]

app = FastAPI()
model = OH.load_model('csl_pretrained')  # OpenHands CSL checkpoint


@app.post("/process_sign")
def process_frame():
    return {"Hello": "World"}
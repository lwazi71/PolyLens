from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from inference import predict_sign
from mapping import label_to_chinese

app = FastAPI()

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LandmarksRequest(BaseModel):
    landmarks: List[List[float]] = Field(..., min_items=21, max_items=21)

class PredictionResponse(BaseModel):
    label: str
    confidence: float

@app.post("/predict-sign", response_model=PredictionResponse)
def predict_sign_endpoint(payload: LandmarksRequest):
    try:
        label, confidence = predict_sign(payload.landmarks)
        chinese_label = label_to_chinese(label)
        return PredictionResponse(label=chinese_label, confidence=confidence)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "ok"}

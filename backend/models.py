from pydantic import BaseModel, Field
from typing import List

# Pydantic schemas for request/response

class LandmarksRequest(BaseModel):
    landmarks: List[List[float]] = Field(..., min_items=21, max_items=21)

class PredictionResponse(BaseModel):
    label: str
    confidence: float

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import time
from inference import predict_sign
from mapping import label_to_chinese

app = FastAPI()
LATENCY_HISTORY_MAX = 500
inference_latencies_ms: List[float] = []

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
    backend_inference_ms: float


class MetricsResponse(BaseModel):
    count: int
    average_latency_ms: float
    p95_latency_ms: float


def _p95_from_values(values: List[float]) -> float:
    if not values:
        return 0.0
    sorted_values = sorted(values)
    n = len(sorted_values)
    index = int(n * 0.95)
    if index >= n:
        index = n - 1
    return sorted_values[index]

@app.post("/predict-sign", response_model=PredictionResponse)
def predict_sign_endpoint(payload: LandmarksRequest):
    try:
        infer_start = time.perf_counter()
        label, confidence = predict_sign(payload.landmarks)
        backend_inference_ms = (time.perf_counter() - infer_start) * 1000.0
        print(f"[BACKEND] inference_ms={backend_inference_ms:.2f}")

        inference_latencies_ms.append(backend_inference_ms)
        if len(inference_latencies_ms) > LATENCY_HISTORY_MAX:
            inference_latencies_ms.pop(0)

        chinese_label = label_to_chinese(label)
        return PredictionResponse(
            label=chinese_label,
            confidence=confidence,
            backend_inference_ms=backend_inference_ms,
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics", response_model=MetricsResponse)
def metrics():
    count = len(inference_latencies_ms)
    if count == 0:
        return MetricsResponse(count=0, average_latency_ms=0.0, p95_latency_ms=0.0)

    average_latency_ms = sum(inference_latencies_ms) / count
    p95_latency_ms = _p95_from_values(inference_latencies_ms)
    return MetricsResponse(
        count=count,
        average_latency_ms=average_latency_ms,
        p95_latency_ms=p95_latency_ms,
    )

@app.get("/")
def root():
    return {"status": "ok"}

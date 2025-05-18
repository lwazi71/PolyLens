# Use official Python 3.9 image (x86_64, compatible with OpenHands dependencies)
FROM python:3.9-slim-bullseye

# System dependencies for mediapipe and OpenHands
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        libsm6 \
        libxext6 \
        libgl1-mesa-glx \
        build-essential \
        git \
        && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements first for better Docker cache
COPY requirements.txt ./
# Copy OpenHands repo before installing it
COPY OpenHands ./OpenHands

RUN pip install --upgrade "pip<24" && \
    pip install torch==1.9.0 torchvision==0.10.0 numpy==1.19.5 && \
    pip install -r requirements.txt && \
    pip install ./OpenHands

# Copy backend code (relative to build context)
COPY . /app/

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

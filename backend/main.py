"""
Crop Yield Prediction API — FastAPI backend.
"""
from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import PredictRequest, PredictResponse
from utils.preprocess import preprocess_input

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup."""
    try:
        from model_loader import get_model
        get_model()
        logger.info("Model ready")
    except FileNotFoundError as e:
        logger.warning("Model not loaded: %s", e)
    yield
    # shutdown: nothing to do


app = FastAPI(
    title="Crop Yield Prediction API",
    description="Predict crop yield from weather and NDVI data (Phase3 RandomForest model).",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health():
    """Health check."""
    try:
        from model_loader import get_model
        get_model()
        return {"status": "ok", "model": "loaded"}
    except Exception as e:
        return {"status": "degraded", "model": "not loaded", "detail": str(e)}


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    """Run preprocessing and model; return prediction and confidence."""
    try:
        from model_loader import predict_yield
        payload = req.model_dump()
        features = preprocess_input(payload)
        prediction, confidence = predict_yield(features)
        return PredictResponse(prediction=round(prediction, 2), confidence=round(confidence, 4))
    except FileNotFoundError as e:
        logger.warning("Model not available: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Model not available. Run: python backend/train_model.py",
        )
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))

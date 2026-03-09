"""
Load or train the yield prediction model.
If yield_model.joblib is missing, trains from Phase3 CSV when available.
"""
from __future__ import annotations

import json
import logging
import os

import joblib
import numpy as np

logger = logging.getLogger(__name__)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BACKEND_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "yield_model.joblib")
FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, "feature_names.json")
META_PATH = os.path.join(MODEL_DIR, "meta.json")


def _load_meta() -> dict:
    if not os.path.isfile(META_PATH):
        return {}
    try:
        with open(META_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {}


def _train_and_save() -> bool:
    """Train model from Phase3 CSV if available; save to MODEL_PATH. Returns True if trained."""
    repo_root = os.path.dirname(BACKEND_DIR)
    for name in ("phase3_input_yield.csv", "Production_with_weather_ndvi.csv"):
        csv_path = os.path.join(repo_root, "Phase3", "csv", name)
        if not os.path.isfile(csv_path):
            continue
        try:
            import pandas as pd
            from sklearn.ensemble import RandomForestRegressor

            df = pd.read_csv(csv_path)
            if "Production" in df.columns and "Yield" in df.columns:
                df = df.drop(columns=["Production"])
            from utils.preprocess import FEATURE_NAMES

            wanted = FEATURE_NAMES + ["Yield"]
            if "Yield" not in df.columns or not all(c in df.columns for c in FEATURE_NAMES):
                continue
            df = df[wanted]
            X = df[FEATURE_NAMES].values.astype(np.float64)
            y = df["Yield"].values.astype(np.float64)
            model = RandomForestRegressor(n_estimators=1000, random_state=42)
            model.fit(X, y)
            os.makedirs(MODEL_DIR, exist_ok=True)
            joblib.dump(model, MODEL_PATH)
            with open(FEATURE_NAMES_PATH, "w") as f:
                json.dump(FEATURE_NAMES, f, indent=2)
            with open(META_PATH, "w") as f:
                meta = {
                    "target": "Yield",
                    "n_samples": int(len(X)),
                    "y_mean": float(np.mean(y)),
                    "y_std": float(np.std(y)),
                    "y_min": float(np.min(y)),
                    "y_max": float(np.max(y)),
                }
                json.dump(meta, f, indent=2)
            logger.info("Trained and saved yield model from %s", csv_path)
            return True
        except Exception as e:
            logger.warning("Could not train from %s: %s", csv_path, e)
    return False


_model: object = None


def get_model():
    """Load model from disk; if missing, try to train from CSV then load."""
    global _model
    if _model is not None:
        return _model
    if os.path.isfile(MODEL_PATH):
        _model = joblib.load(MODEL_PATH)
        logger.info("Loaded yield model from %s", MODEL_PATH)
        return _model
    if _train_and_save():
        _model = joblib.load(MODEL_PATH)
        return _model
    raise FileNotFoundError(
        "Yield model not found. Run: python backend/train_model.py"
    )


def predict_yield(features: np.ndarray):
    """Return (prediction, confidence).

    Confidence is derived from uncertainty across trees, scaled by the target
    distribution (std of Yield) so it doesn't collapse to very low values.
    """
    model = get_model()
    pred = model.predict(features)
    # Confidence from tree-level predictions (std across trees)
    if hasattr(model, "estimators_") and len(model.estimators_) > 0:
        tree_preds = np.array([t.predict(features)[0] for t in model.estimators_])
        std = float(np.std(tree_preds))
        meta = _load_meta()
        y_std = float(meta.get("y_std") or 0.0)
        # Fallback: if meta missing, use a sane default scale
        scale = y_std if y_std > 1e-9 else 15.0
        # Map to 0-1: larger std relative to target variance => lower confidence
        confidence = float(np.exp(-std / scale))
        confidence = float(min(1.0, max(0.0, confidence)))
    else:
        confidence = 0.85
    return float(pred[0]), confidence

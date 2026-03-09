"""
Train RandomForest yield model from Phase3 data and save for API.
Run from repo root: python backend/train_model.py
Or with custom CSV: python backend/train_model.py --csv path/to/phase3_input_yield.csv
"""
from __future__ import annotations

import argparse
import json
import os
import sys

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils.preprocess import FEATURE_NAMES

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
os.makedirs(MODEL_DIR, exist_ok=True)
META_PATH = os.path.join(MODEL_DIR, "meta.json")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--csv",
        default=None,
        help="Path to phase3_input_yield.csv (default: repo Phase3/csv/phase3_input_yield.csv)",
    )
    args = parser.parse_args()

    if args.csv and os.path.isfile(args.csv):
        csv_path = args.csv
    else:
        repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        csv_path = os.path.join(
            repo_root, "Phase3", "csv", "phase3_input_yield.csv"
        )
        if not os.path.isfile(csv_path):
            alt = os.path.join(repo_root, "Phase3", "csv", "Production_with_weather_ndvi.csv")
            if os.path.isfile(alt):
                csv_path = alt
            else:
                raise FileNotFoundError(
                    f"CSV not found. Use --csv to specify phase3_input_yield.csv. Tried: {csv_path}"
                )

    df = pd.read_csv(csv_path)
    if "Production" in df.columns and "Yield" in df.columns:
        df = df.drop(columns=["Production"])
    if "Yield" not in df.columns:
        raise ValueError("CSV must contain a 'Yield' column.")

    # Enforce column order expected by preprocessing
    wanted = FEATURE_NAMES + ["Yield"]
    for c in wanted:
        if c not in df.columns:
            raise ValueError(f"Missing column: {c}")
    df = df[wanted]

    X = df[FEATURE_NAMES].values.astype(np.float64)
    y = df["Yield"].values.astype(np.float64)

    model = RandomForestRegressor(n_estimators=1000, random_state=42)
    model.fit(X, y)

    model_path = os.path.join(MODEL_DIR, "yield_model.joblib")
    import joblib

    joblib.dump(model, model_path)
    with open(os.path.join(MODEL_DIR, "feature_names.json"), "w") as f:
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
    print(f"Model saved to {model_path}")
    print(f"Feature names saved. Trained on {len(X)} samples.")
    print(f"Meta saved to {META_PATH}")


if __name__ == "__main__":
    main()

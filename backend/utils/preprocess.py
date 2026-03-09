"""
Preprocessing utilities matching Phase3 Yield_Prediction.ipynb.
Feature order: Year, Precipitation, maxtemp, mintemp, avgtemp, specifichumidity,
relativehumidity, surfacepressure, dewpoints, minwindspeed, maxwindspeed,
cloudcoverage, Nitrogen, Phosphorus, Pottasium, pH, NDVI.
"""
from __future__ import annotations

import logging
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

FEATURE_NAMES = [
    "Year",
    "Precipitation",
    "maxtemp",
    "mintemp",
    "avgtemp",
    "specifichumidity",
    "relativehumidity",
    "surfacepressure",
    "dewpoints",
    "minwindspeed",
    "maxwindspeed",
    "cloudcoverage",
    "Nitrogen",
    "Phosphorus",
    "Pottasium",
    "pH",
    "NDVI",
]


def _clamp(value: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, value))


def preprocess_input(payload: dict[str, Any]) -> np.ndarray:
    """
    Build feature vector in the exact order expected by the trained model.
    Validates and clamps values to training data ranges where appropriate.
    """
    year = int(payload.get("year", 2020))
    precipitation = float(payload.get("precipitation", 0))
    maxtemp = float(payload.get("maxtemp", 32.0))
    mintemp = float(payload.get("mintemp", 19.0))
    avgtemp = float(payload.get("avgtemp", 13.0))
    specifichumidity = _clamp(float(payload.get("specifichumidity", 0.0115)), 0.01, 0.013)
    relativehumidity = _clamp(float(payload.get("relativehumidity", 54)), 49, 60)
    surfacepressure = _clamp(float(payload.get("surfacepressure", 94.0)), 93.9, 94.2)
    dewpoints = _clamp(float(payload.get("dewpoints", 14.0)), 12, 16)
    minwindspeed = _clamp(float(payload.get("minwindspeed", 2.5)), 2.2, 2.8)
    maxwindspeed = _clamp(float(payload.get("maxwindspeed", 6.0)), 5.7, 6.4)
    cloudcoverage = _clamp(float(payload.get("cloudcoverage", 0.55)), 0.54, 0.60)
    nitrogen = int(payload.get("nitrogen", 0))
    phosphorus = int(payload.get("phosphorus", 1))
    pottasium = int(payload.get("pottasium", 1))
    ph = int(payload.get("ph", 2))
    ndvi = _clamp(float(payload.get("ndvi", 0.45)), -1.0, 1.0)

    features = np.array(
        [
            [
                year,
                precipitation,
                maxtemp,
                mintemp,
                avgtemp,
                specifichumidity,
                relativehumidity,
                surfacepressure,
                dewpoints,
                minwindspeed,
                maxwindspeed,
                cloudcoverage,
                nitrogen,
                phosphorus,
                pottasium,
                ph,
                ndvi,
            ]
        ],
        dtype=np.float64,
    )
    return features

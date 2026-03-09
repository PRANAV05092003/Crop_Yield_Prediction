from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    year: int = Field(..., ge=1990, le=2030, description="Crop year")
    precipitation: float = Field(..., ge=0, le=2000, description="Precipitation (mm)")
    maxtemp: float = Field(..., ge=20, le=45, description="Max temperature (°C)")
    mintemp: float = Field(..., ge=10, le=30, description="Min temperature (°C)")
    avgtemp: float = Field(..., ge=10, le=25, description="Average temperature (°C)")
    specifichumidity: float = Field(..., ge=0.008, le=0.02, description="Specific humidity")
    relativehumidity: float = Field(..., ge=30, le=90, description="Relative humidity (%)")
    surfacepressure: float = Field(..., ge=90, le=100, description="Surface pressure (kPa)")
    dewpoints: float = Field(..., ge=5, le=25, description="Dew point (°C)")
    minwindspeed: float = Field(..., ge=0, le=10, description="Min wind speed (m/s)")
    maxwindspeed: float = Field(..., ge=0, le=15, description="Max wind speed (m/s)")
    cloudcoverage: float = Field(..., ge=0, le=1, description="Cloud coverage (0-1)")
    nitrogen: int = Field(..., ge=-2, le=2, description="Nitrogen level (-2 to 2)")
    phosphorus: int = Field(..., ge=-2, le=2, description="Phosphorus level (-2 to 2)")
    pottasium: int = Field(..., ge=0, le=2, description="Potassium level (0-2)")
    ph: int = Field(..., ge=1, le=4, description="Soil pH category (1-4)")
    ndvi: float = Field(..., ge=-1, le=1, description="NDVI index (-1 to 1)")


class PredictResponse(BaseModel):
    prediction: float = Field(..., description="Predicted crop yield")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")

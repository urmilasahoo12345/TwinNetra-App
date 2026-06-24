from pydantic import BaseModel
from typing import Optional, List


class LoginRequest(BaseModel):
    # 👇 Changed from EmailStr to str
    email: str
    password: str

# 👇 ADDED: The SignupRequest model for new user registration
class SignupRequest(BaseModel):
    name: str
    # 👇 Changed from EmailStr to str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    user_email: str
    role: str


class ClimateRecord(BaseModel):
    time: str
    rainfall: float
    max_temp: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    month: int


class ClimateOverview(BaseModel):
    avg_rainfall: float
    avg_temp: float
    max_rainfall: float
    max_temp: float
    heatwave_count: int
    wettest_month: int
    hottest_month: int
    rainfall_temp_correlation: float


class PredictionRequest(BaseModel):
    district: str
    rainfall: float
    temperature: float
    month: int
    day: int


class PredictionResponse(BaseModel):
    predicted_temp: float
    predicted_rain: float
    temp_risk: str
    rain_risk: str
    temp_model_r2: float
    rain_model_r2: float


class LiveWeatherResult(BaseModel):
    district: str
    live_temp: float
    historical_temp: float
    difference: float
    humidity: float
    rainfall: float
    status: str


class SatelliteLSTResponse(BaseModel):
    avg_lst: float
    max_lst: float
    min_lst: float
    points: List[dict]
    loaded: bool
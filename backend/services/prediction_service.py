import joblib
import numpy as np
from pathlib import Path

DISTRICT_COORDS = {
    "Bhubaneswar": (20.2961, 85.8245),
    "Cuttack": (20.4625, 85.8828),
    "Puri": (19.8135, 85.8312),
    "Sambalpur": (21.4669, 83.9812),
    "Rourkela": (22.2604, 84.8536),
    "Balasore": (21.4942, 86.9317),
}

_temp_model = None
_rain_model = None


def _load_models():
    global _temp_model, _rain_model
    if _temp_model is None:
        _temp_model = joblib.load("temperature_model.pkl")
        _rain_model = joblib.load("rainfall_model.pkl")


def predict(district: str, rainfall: float, temperature: float, month: int, day: int) -> dict:
    _load_models()
    lat, lon = DISTRICT_COORDS[district]

    pred_temp = float(_temp_model.predict([[lat, lon, month, day, rainfall]])[0])
    pred_rain = float(_rain_model.predict([[lat, lon, month, day, temperature]])[0])

    temp_risk = (
        "Heatwave Risk" if pred_temp > 40
        else "High Temperature Warning" if pred_temp > 37
        else "Normal"
    )
    rain_risk = (
        "Extreme Rainfall Risk" if pred_rain > 100
        else "Heavy Rainfall Possible" if pred_rain > 50
        else "Normal"
    )

    return {
        "predicted_temp": round(pred_temp, 2),
        "predicted_rain": round(pred_rain, 2),
        "temp_risk": temp_risk,
        "rain_risk": rain_risk,
        "temp_model_r2": 0.97,
        "rain_model_r2": 0.31,
    }


def get_districts() -> list:
    return list(DISTRICT_COORDS.keys())

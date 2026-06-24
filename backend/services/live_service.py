import requests
import pandas as pd
from services.climate_service import load_data
from core.config import settings

DISTRICTS = {
    "Bhubaneswar": (20.2961, 85.8245),
    "Cuttack": (20.4625, 85.8828),
    "Puri": (19.8135, 85.8312),
    "Sambalpur": (21.4669, 83.9812),
    "Rourkela": (22.2604, 84.8536),
    "Balasore": (21.4942, 86.9317),
}


def fetch_live_comparison() -> list:
    df = load_data()
    current_month = pd.Timestamp.now().month
    historical_df = df[df["TIME"].dt.month == current_month]
    results = []

    for district, (lat, lon) in DISTRICTS.items():
        try:
            url = (
                f"{settings.OPEN_METEO_BASE_URL}"
                f"?latitude={lat}&longitude={lon}"
                f"&current=temperature_2m,relative_humidity_2m,rain"
            )
            resp = requests.get(url, timeout=8)
            resp.raise_for_status()
            data = resp.json()["current"]

            live_temp = data["temperature_2m"]
            humidity = data["relative_humidity_2m"]
            rain = data["rain"]

            nearest = historical_df[
                (abs(historical_df["LATITUDE"] - lat) <= 1.0)
                & (abs(historical_df["LONGITUDE"] - lon) <= 1.0)
            ]
            hist_temp = float(nearest["MAX_TEMP"].mean()) if not nearest.empty else float("nan")
            diff = round(live_temp - hist_temp, 2) if not pd.isna(hist_temp) else 0.0
            status = (
                "Above Normal" if diff > 2
                else "Below Normal" if diff < -2
                else "Normal"
            )

            results.append({
                "district": district,
                "live_temp": round(live_temp, 2),
                "historical_temp": round(hist_temp, 2) if not pd.isna(hist_temp) else None,
                "difference": diff,
                "humidity": humidity,
                "rainfall": rain,
                "status": status,
            })
        except Exception as e:
            results.append({
                "district": district,
                "live_temp": None,
                "historical_temp": None,
                "difference": None,
                "humidity": None,
                "rainfall": None,
                "status": "Unavailable",
                "error": str(e),
            })

    return results

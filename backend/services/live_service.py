import pandas as pd
from services.climate_service import load_data

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
        # Find nearest historical data points
        nearest = historical_df[
            (abs(historical_df["LATITUDE"] - lat) <= 1.0)
            & (abs(historical_df["LONGITUDE"] - lon) <= 1.0)
        ]
        
        hist_temp = float(nearest["MAX_TEMP"].mean()) if not nearest.empty else float("nan")

        # We just return the historical baseline and coordinates now
        results.append({
            "district": district,
            "lat": lat,
            "lon": lon,
            "historical_temp": round(hist_temp, 2) if not pd.isna(hist_temp) else None,
        })

    return results

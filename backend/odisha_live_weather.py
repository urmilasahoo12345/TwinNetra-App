import requests
import pandas as pd
from tabulate import tabulate

districts = {
    "Bhubaneswar": (20.2961, 85.8245),
    "Cuttack": (20.4625, 85.8828),
    "Puri": (19.8135, 85.8312),
    "Sambalpur": (21.4669, 83.9812),
    "Rourkela": (22.2604, 84.8536),
    "Balasore": (21.4942, 86.9317)
}

results = []

for district, (lat, lon) in districts.items():

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,rain"
    )

    data = requests.get(url).json()

    results.append({
        "District": district,
        "Temp (°C)": data["current"]["temperature_2m"],
        "Humidity (%)": data["current"]["relative_humidity_2m"],
        "Rainfall (mm)": data["current"]["rain"]
    })

df = pd.DataFrame(results)

print("\n===== ODISHA LIVE WEATHER =====\n")
print(tabulate(df, headers="keys", tablefmt="grid"))
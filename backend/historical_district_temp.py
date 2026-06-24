import pandas as pd

# Load TwinNetra dataset
df = pd.read_csv("twinnetra_climate_2024.csv")

# Convert date
df["TIME"] = pd.to_datetime(df["TIME"])

# June data only
june_df = df[df["TIME"].dt.month == 6]

districts = {
    "Bhubaneswar": (20.2961, 85.8245),
    "Cuttack": (20.4625, 85.8828),
    "Puri": (19.8135, 85.8312),
    "Sambalpur": (21.4669, 83.9812),
    "Rourkela": (22.2604, 84.8536),
    "Balasore": (21.4942, 86.9317)
}

print("\n===== HISTORICAL JUNE 2024 TEMPERATURE =====\n")

for district, (lat, lon) in districts.items():

    nearest = june_df[
        (abs(june_df["LATITUDE"] - lat) <= 1.0) &
        (abs(june_df["LONGITUDE"] - lon) <= 1.0)
    ]

    avg_temp = nearest["MAX_TEMP"].mean()

    print(
        district,
        "->",
        round(avg_temp, 2),
        "°C"
    )
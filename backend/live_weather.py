import requests

# Bhubaneswar coordinates
lat = 20.2961
lon = 85.8245

url = (
    f"https://api.open-meteo.com/v1/forecast"
    f"?latitude={lat}"
    f"&longitude={lon}"
    f"&current=temperature_2m,relative_humidity_2m,rain"
)

response = requests.get(url)

data = response.json()

print("\n===== LIVE WEATHER =====")

print("Time:", data["current"]["time"])
print("Temperature:", data["current"]["temperature_2m"], "°C")
print("Humidity:", data["current"]["relative_humidity_2m"], "%")
print("Rainfall:", data["current"]["rain"], "mm")
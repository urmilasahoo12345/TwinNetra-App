import numpy as np
import h5py
from core.config import settings

_cache = None


def load_satellite() -> dict:
    global _cache
    if _cache is not None:
        return _cache

    try:
        with h5py.File(settings.MOSDAC_FILE, "r") as f:
            lst = f["LST"][0].astype(float)
            lat = f["Latitude"][:].astype(float)
            lon = f["Longitude"][:].astype(float)

        lat[lat == 32767] = np.nan
        lon[lon == 32767] = np.nan
        lat *= 0.01
        lon *= 0.01
        lst[lst == -999] = np.nan

        mask = (lat >= 17.5) & (lat <= 22.5) & (lon >= 81.5) & (lon <= 87.5)
        odisha_temp = (lst - 273.15)[mask]
        odisha_lat = lat[mask]
        odisha_lon = lon[mask]

        valid = ~np.isnan(odisha_temp)
        # Downsample to 2000 points max for API response
        indices = np.where(valid)[0]
        if len(indices) > 2000:
            indices = np.random.choice(indices, 2000, replace=False)

        points = [
            {"lat": float(odisha_lat[i]), "lon": float(odisha_lon[i]), "lst": float(odisha_temp[i])}
            for i in indices
        ]

        _cache = {
            "loaded": True,
            "avg_lst": round(float(np.nanmean(odisha_temp)), 2),
            "max_lst": round(float(np.nanmax(odisha_temp)), 2),
            "min_lst": round(float(np.nanmin(odisha_temp)), 2),
            "points": points,
        }
    except Exception as e:
        _cache = {"loaded": False, "error": str(e), "points": [], "avg_lst": 0, "max_lst": 0, "min_lst": 0}

    return _cache

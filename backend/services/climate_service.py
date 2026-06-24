import pandas as pd
import numpy as np
from core.config import settings

_df: pd.DataFrame = None


def load_data() -> pd.DataFrame:
    global _df
    if _df is None:
        _df = pd.read_csv(settings.DATA_FILE)
        _df["TIME"] = pd.to_datetime(_df["TIME"])
        _df["MONTH"] = _df["TIME"].dt.month
    return _df


def get_overview(month: int | None = None) -> dict:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]

    wettest = int(df.groupby("MONTH")["RAINFALL"].mean().idxmax())
    hottest = int(df.groupby("MONTH")["MAX_TEMP"].mean().idxmax())
    corr = float(df[["RAINFALL", "MAX_TEMP"]].corr().iloc[0, 1])
    heatwaves = int(len(filtered[filtered["MAX_TEMP"] >= 40]))

    return {
        "avg_rainfall": round(float(filtered["RAINFALL"].mean()), 2),
        "avg_temp": round(float(filtered["MAX_TEMP"].mean()), 2),
        "max_rainfall": round(float(filtered["RAINFALL"].max()), 2),
        "max_temp": round(float(filtered["MAX_TEMP"].max()), 2),
        "heatwave_count": heatwaves,
        "wettest_month": wettest,
        "hottest_month": hottest,
        "rainfall_temp_correlation": round(corr, 3),
    }


def get_trend(month: int | None = None) -> list:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]
    daily = (
        filtered.groupby("TIME")
        .agg({"RAINFALL": "mean", "MAX_TEMP": "mean"})
        .reset_index()
    )
    daily["TIME"] = daily["TIME"].dt.strftime("%Y-%m-%d")
    return daily.to_dict(orient="records")


def get_monthly_averages() -> dict:
    df = load_data()
    rain = df.groupby("MONTH")["RAINFALL"].mean().reset_index()
    temp = df.groupby("MONTH")["MAX_TEMP"].mean().reset_index()
    return {
        "rainfall": rain.to_dict(orient="records"),
        "temperature": temp.to_dict(orient="records"),
    }


def get_spatial(variable: str, month: int | None = None) -> list:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]
    cols = ["LATITUDE", "LONGITUDE", variable]
    available = [c for c in cols if c in filtered.columns]
    if len(available) < 3:
        return []
    spatial = (
        filtered.groupby(["LATITUDE", "LONGITUDE"])[variable]
        .mean()
        .reset_index()
        .dropna()
    )
    return spatial.to_dict(orient="records")


def get_raw(month: int | None = None, limit: int = 100) -> list:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]
    subset = filtered.head(limit).copy()
    subset["TIME"] = subset["TIME"].dt.strftime("%Y-%m-%d")
    return subset.to_dict(orient="records")


def get_top_events(variable: str, month: int | None = None, n: int = 10) -> list:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]
    top = filtered.nlargest(n, variable).copy()
    top["TIME"] = top["TIME"].dt.strftime("%Y-%m-%d")
    return top.to_dict(orient="records")


def get_scatter(month: int | None = None) -> list:
    df = load_data()
    filtered = df if month is None else df[df["MONTH"] == month]
    subset = filtered[["MAX_TEMP", "RAINFALL"]].dropna().sample(
        min(1000, len(filtered)), random_state=42
    )
    return subset.to_dict(orient="records")

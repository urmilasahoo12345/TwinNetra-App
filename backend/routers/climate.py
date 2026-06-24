import math
import simplejson as json  # simplejson automatically converts NaN to null safely
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from typing import Optional
from routers.auth import get_current_user
from services import climate_service

router = APIRouter(prefix="/climate", tags=["climate"])


def safe_json_response(data):
    """
    Bypasses FastAPI's default json encoder to stringify 
    and convert NaNs into compliant JSON null fields seamlessly.
    """
    # If data is a pandas DataFrame or Series, unpack it first
    if hasattr(data, "to_dict"):
        try:
            data = data.to_dict(orient="records")
        except Exception:
            data = data.to_dict()

    # simplejson handles custom float types and converts NaN -> null effortlessly
    serialized_data = json.dumps(data, ignore_nan=True, default=str)
    return Response(content=serialized_data, media_type="application/json")


@router.get("/overview")
def overview(month: Optional[int] = None, _=Depends(get_current_user)):
    data = climate_service.get_overview(month)
    return safe_json_response(data)


@router.get("/trend")
def trend(month: Optional[int] = None, _=Depends(get_current_user)):
    data = climate_service.get_trend(month)
    return safe_json_response(data)


@router.get("/monthly-averages")
def monthly_averages(_=Depends(get_current_user)):
    data = climate_service.get_monthly_averages()
    return safe_json_response(data)


@router.get("/spatial")
def spatial(
    variable: str = Query("RAINFALL", enum=["RAINFALL", "MAX_TEMP"]),
    month: Optional[int] = None,
    _=Depends(get_current_user),
):
    data = climate_service.get_spatial(variable, month)
    return safe_json_response(data)


@router.get("/raw")
def raw(month: Optional[int] = None, limit: int = 100, _=Depends(get_current_user)):
    data = climate_service.get_raw(month, limit)
    return safe_json_response(data)


@router.get("/top-events")
def top_events(
    variable: str = Query("RAINFALL", enum=["RAINFALL", "MAX_TEMP"]),
    month: Optional[int] = None,
    n: int = 10,
    _=Depends(get_current_user),
):
    data = climate_service.get_top_events(variable, month, n)
    return safe_json_response(data)


@router.get("/scatter")
def scatter(month: Optional[int] = None, _=Depends(get_current_user)):
    data = climate_service.get_scatter(month)
    return safe_json_response(data)


@router.get("/correlation")
def correlation(_=Depends(get_current_user)):
    from services.climate_service import load_data
    df = load_data()
    corr = df[["RAINFALL", "MAX_TEMP"]].corr().round(3)
    return safe_json_response(corr.to_dict(orient="index"))
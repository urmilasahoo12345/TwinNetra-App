from fastapi import APIRouter, Depends, Query
from routers.auth import get_current_user
from services import satellite_service

router = APIRouter(prefix="/satellite", tags=["satellite"])


@router.get("/lst")
def lst(_=Depends(get_current_user)):
    return satellite_service.load_satellite()


@router.get("/scenario")
def scenario(future_rise: float = Query(2.0), _=Depends(get_current_user)):
    data = satellite_service.load_satellite()
    if not data["loaded"]:
        return data
    return {
        **data,
        "future_rise": future_rise,
        "future_lst": round(data["avg_lst"] + future_rise, 2),
    }

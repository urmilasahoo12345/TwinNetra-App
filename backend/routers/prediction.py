from fastapi import APIRouter, Depends
from routers.auth import get_current_user
from services import prediction_service
from models.schemas import PredictionRequest

router = APIRouter(prefix="/prediction", tags=["prediction"])


@router.get("/districts")
def districts(_=Depends(get_current_user)):
    return prediction_service.get_districts()


@router.post("/predict")
def predict(payload: PredictionRequest, _=Depends(get_current_user)):
    return prediction_service.predict(
        payload.district,
        payload.rainfall,
        payload.temperature,
        payload.month,
        payload.day,
    )

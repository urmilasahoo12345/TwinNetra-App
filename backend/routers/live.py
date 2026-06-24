import simplejson as json
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from routers.auth import get_current_user
from services import live_service

router = APIRouter(prefix="/live", tags=["live"])


def safe_json_response(data):
    """Converts Pandas/NumPy objects and safely translates NaNs to null."""
    if hasattr(data, "to_dict"):
        try:
            data = data.to_dict(orient="records")
        except Exception:
            data = data.to_dict()

    serialized_data = json.dumps(data, ignore_nan=True, default=str)
    return Response(content=serialized_data, media_type="application/json")


@router.get("/comparison")
def comparison(_=Depends(get_current_user)):
    # 🌟 Calling the correct function now
    data = live_service.fetch_live_comparison()
    return safe_json_response(data)
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas import ApiResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard():
    dashboard_data = {
        "title": "Dashboard",
        "stats": {
            "total_users": 0,
            "active_sessions": 0
        }
    }
    response = ApiResponse.success(data=dashboard_data, message="Dashboard data retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())

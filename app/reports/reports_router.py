from fastapi import APIRouter, Depends
from app.dependencies import get_current_user

router = APIRouter(prefix="/reports")

@router.get("/weekly")
def weekly(user = Depends(get_current_user)):
    return {
        "user_id": user.id,
        "summary": "Weekly report generated"
    }

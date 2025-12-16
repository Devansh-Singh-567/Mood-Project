from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models import MoodLog
from app.schemas import MoodCreate
from app.dependencies import get_db, get_current_user
from app.mood.mood_scores import mood_to_score

router = APIRouter(prefix="/mood")

@router.post("/log")
def log_mood(
    data: MoodCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    log = MoodLog(
        user_id=user.id,
        mood=data.mood,
        intensity=data.intensity
    )
    db.add(log)
    db.commit()
    return {"msg": "Mood logged"}

@router.get("/history")
def mood_history(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    logs = (
        db.query(MoodLog)
        .filter(MoodLog.user_id == user.id)
        .order_by(MoodLog.created_at)
        .all()
    )

    return [
        {
            "date": log.created_at.isoformat(),
            "mood": log.mood.value,
            "intensity": log.intensity,
            "score": mood_to_score(log.mood), # type: ignore
        }
        for log in logs
    ]

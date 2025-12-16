from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models import Reminder
from app.schemas import ReminderCreate
from app.dependencies import get_db, get_current_user

router = APIRouter(prefix="/reminders")

@router.post("/")
def add_reminder(
    data: ReminderCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    r = Reminder(user_id=user.id, title=data.title, time=data.time)
    db.add(r)
    db.commit()
    return {"msg": "Reminder added"}

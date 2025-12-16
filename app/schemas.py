from pydantic import BaseModel
from .models import MoodEnum

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class MoodCreate(BaseModel):
    mood: MoodEnum
    intensity: int

class ReminderCreate(BaseModel):
    title: str
    time: str

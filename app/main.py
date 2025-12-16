from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.auth.auth_router import router as auth_router
from app.mood.mood_router import router as mood_router
from app.reminders.reminders_router import router as reminder_router
from app.reports.reports_router import router as report_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mood Wellness App")

app.include_router(auth_router)
app.include_router(mood_router)
app.include_router(reminder_router)
app.include_router(report_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



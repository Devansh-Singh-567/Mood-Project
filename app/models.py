from sqlalchemy import Column, Integer, String, DateTime, Enum, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class MoodEnum(str, enum.Enum):
    overwhelmed = "Overwhelmed"
    demotivated = "Demotivated"
    anxious = "Anxious"
    stressed = "Stressed"
    sad = "Sad"
    lazy = "Lazy"
    bored = "Bored"
    neutral = "Neutral"
    motivated = "Motivated"
    happy = "Happy"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood = Column(Enum(MoodEnum))
    intensity = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True)
    mood = Column(Enum(MoodEnum))
    text = Column(Text)

class Story(Base):
    __tablename__ = "stories"
    id = Column(Integer, primary_key=True)
    mood = Column(Enum(MoodEnum))
    content = Column(Text)

class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True)
    mood = Column(Enum(MoodEnum))
    title = Column(String)
    url = Column(String)

class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True)
    mood = Column(Enum(MoodEnum))
    title = Column(String)

class Rotation(Base):
    __tablename__ = "rotation"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    mood = Column(String)
    type = Column(String)
    index = Column(Integer, default=0)

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    title = Column(String)
    time = Column(String)
    active = Column(Boolean, default=True)

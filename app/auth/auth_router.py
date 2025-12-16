from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate
from .hashing import hash_password, verify
from .jwt_handler import create_token

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    return {"msg": "Registered"}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify(form.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_token(user.id),
        "token_type": "bearer"
    }

import jwt, os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "secret")

def create_token(user_id: int):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

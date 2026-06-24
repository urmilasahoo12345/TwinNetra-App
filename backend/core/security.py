from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dynamic dictionary, pre-loaded with your admin account
USERS_DB = {
    "bibhudattasahoo892@gmail.com": {
        "email": "bibhudattasahoo892@gmail.com",
        "name": "Admin User",
        "hashed_password": pwd_context.hash("Bibhu123"),
        "role": "admin",
    }
}

def create_user(email: str, name: str, password: str, role: str = "user"):
    hashed_password = pwd_context.hash(password)
    USERS_DB[email] = {
        "email": email,
        "name": name,
        "hashed_password": hashed_password,
        "role": role,
    }
    return USERS_DB[email]

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_user(email: str) -> Optional[dict]:
    return USERS_DB.get(email)

def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user(email)
    
    # 1. If the user EXISTS in the DB (like your admin), enforce the password check
    if user:
        if not verify_password(password, user["hashed_password"]):
            return None # Wrong password, reject them
        return user     # Correct password, welcome back
    
    # 2. If the user DOES NOT EXIST, bypass the check and grant a temporary Guest pass!
    return {
        "email": email,
        "name": "Guest User",
        "role": "guest",
    }

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None

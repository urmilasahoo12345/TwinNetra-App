from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from core.security import authenticate_user, create_access_token, decode_token, create_user, get_user
from models.schemas import LoginRequest, TokenResponse, SignupRequest

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/signup")
def signup(payload: SignupRequest):
    # Prevent duplicate accounts
    if get_user(payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # Create the new user
    user = create_user(
        email=payload.email, 
        name=payload.name, 
        password=payload.password, 
        role="user"
    )
    return {"message": "User created successfully", "email": user["email"]}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["email"], "role": user["role"]})
    return TokenResponse(
        access_token=token,
        user_name=user["name"],
        user_email=user["email"],
        role=user["role"],
    )

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return user
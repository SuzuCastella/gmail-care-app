from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.schemas.user import UserCreate, UserLogin, UserOut
from backend.models.user import User
from backend.utils.auth_utils import hash_password, verify_password, create_access_token
from backend import gmail_utils

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_create.password)
    user = User(
        email=user_create.email,
        name=user_create.name,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.post("/login")
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "user": {
            "email": user.email,
            "name": user.name
        }
    }

@router.get("/gmail_auth")
def gmail_auth(email: str):
    try:
        gmail_utils.get_gmail_service(user_email=email)
        return JSONResponse(content={"status": "Gmail認証成功"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Gmail認証失敗: {str(e)}"})

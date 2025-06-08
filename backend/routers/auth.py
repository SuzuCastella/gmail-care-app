from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.user import UserCreate, UserLogin, UserOut
from backend.models.user import User
from backend.db import get_db
from backend.utils.auth_utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter(tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="メールアドレスまたはパスワードが間違っています")

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=60 * 24)  # 24時間
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "created_at": db_user.created_at
        }
    }

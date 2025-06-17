from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.models.user import User
from pydantic import BaseModel
import shutil, os
import bcrypt
from fastapi.responses import FileResponse

router = APIRouter(prefix="/user", tags=["User"])

# -------------------------------
# スキーマ定義
# -------------------------------

class UpdateInfoRequest(BaseModel):
    user_email: str
    name: str
    name_kana: str

class ChangePasswordRequest(BaseModel):
    user_email: str
    current_password: str
    new_password: str

class KotoriFlagUpdateRequest(BaseModel):
    user_email: str
    enabled: bool

# -------------------------------
# ユーザー情報更新API
# -------------------------------

@router.put("/update_info")
def update_info(req: UpdateInfoRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")

    user.name = req.name
    user.name_kana = req.name_kana
    db.commit()
    return {"status": "success", "message": "情報を更新しました"}

# -------------------------------
# パスワード変更API（ハッシュ照合付き）
# -------------------------------

@router.put("/change_password")
def change_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")

    if not bcrypt.checkpw(req.current_password.encode("utf-8"), user.hashed_password.encode("utf-8")):
        raise HTTPException(status_code=400, detail="現在のパスワードが一致しません")

    hashed_new = bcrypt.hashpw(req.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user.hashed_password = hashed_new
    db.commit()
    return {"status": "success", "message": "パスワードを変更しました"}

# -------------------------------
# アイコン更新API
# -------------------------------

@router.post("/update_icon")
def update_icon(user_email: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが存在しません")

    save_dir = "data/icons"
    os.makedirs(save_dir, exist_ok=True)
    filename = f"{user.id}.png"
    save_path = os.path.join(save_dir, filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    user.icon = filename
    db.commit()

    return {"status": "success", "message": "アイコンを更新しました"}

# -------------------------------
# アイコン取得API
# -------------------------------

@router.get("/icon/{user_id}")
def get_icon(user_id: int):
    save_path = f"data/icons/{user_id}.png"
    if not os.path.exists(save_path):
        raise HTTPException(status_code=404, detail="アイコンが存在しません")
    return FileResponse(save_path)

# ✅ ことり機能ON/OFF更新API
@router.put("/update_kotori_flag")
def update_kotori_flag(payload: KotoriFlagUpdateRequest, db: Session = Depends(get_db)):
    user_email = payload.user_email
    enabled = payload.enabled

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.kotori_enabled = enabled
    db.commit()
    return {"message": "Updated kotori flag"}
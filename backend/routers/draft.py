from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.models import Draft
from fastapi import Depends
from datetime import datetime

router = APIRouter(prefix="/drafts", tags=["drafts"])

# Pydanticスキーマ
class DraftCreate(BaseModel):
    user_email: str
    to: str
    cc: str
    bcc: str
    subject: str
    body: str

class DraftResponse(BaseModel):
    id: int
    user_email: str
    to: str
    cc: str
    bcc: str
    subject: str
    body: str
    created_at: datetime
    updated_at: datetime

# 新規作成
@router.post("/", response_model=DraftResponse)
def create_draft(draft: DraftCreate, db: Session = Depends(get_db)):
    db_draft = Draft(**draft.dict())
    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)
    return db_draft

# ユーザの下書き全取得
@router.get("/{user_email}", response_model=List[DraftResponse])
def get_drafts(user_email: str, db: Session = Depends(get_db)):
    drafts = db.query(Draft).filter(Draft.user_email == user_email).all()
    return drafts

# 下書き更新
@router.put("/{draft_id}", response_model=DraftResponse)
def update_draft(draft_id: int, draft: DraftCreate, db: Session = Depends(get_db)):
    db_draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if db_draft is None:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    for key, value in draft.dict().items():
        setattr(db_draft, key, value)

    db.commit()
    db.refresh(db_draft)
    return db_draft

# 下書き削除
@router.delete("/{draft_id}", response_model=dict)
def delete_draft(draft_id: int, db: Session = Depends(get_db)):
    db_draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if db_draft is None:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    db.delete(db_draft)
    db.commit()
    return {"detail": "Deleted successfully"}

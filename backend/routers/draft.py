from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend import models
from backend.db import get_db
from backend.schemas.draft import DraftCreate, DraftInDB

router = APIRouter(prefix="/drafts", tags=["drafts"])

@router.post("/", response_model=DraftInDB)
def create_draft(draft: DraftCreate, db: Session = Depends(get_db)):
    # dictからSQLAlchemyモデル用にキー変換
    data = draft.dict()
    data["to_"] = data.pop("to")
    db_draft = models.draft.Draft(**draft.dict())
    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)
    return db_draft

@router.get("/{user_email}", response_model=List[DraftInDB])
def get_drafts(user_email: str, db: Session = Depends(get_db)):
    drafts = db.query(models.draft.Draft).filter_by(user_email=user_email).all()
    return drafts

@router.delete("/{draft_id}")
def delete_draft(draft_id: int, db: Session = Depends(get_db)):
    draft_obj = db.query(models.draft.Draft).filter_by(id=draft_id).first()
    if not draft_obj:
        raise HTTPException(status_code=404, detail="Draft not found")
    db.delete(draft_obj)
    db.commit()
    return {"message": "Draft deleted"}

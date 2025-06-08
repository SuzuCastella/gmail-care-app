from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os

router = APIRouter(prefix="/mail", tags=["mail"])  # ← router に統一

MAIL_CACHE_PATH = os.path.join("data", "mail_cache.json")

class Mail(BaseModel):
    id: str
    from_: str
    to: str
    subject: str
    snippet: str
    emotion: str = "neutral"

class MailRequest(BaseModel):
    email: str

@router.post("/list", response_model=List[Mail])
def list_mails(request: MailRequest):
    try:
        with open(MAIL_CACHE_PATH, "r", encoding="utf-8") as f:
            all_mails = json.load(f)

        # 指定された email 宛てのメールのみ抽出
        user_mails = [
            Mail(
                id=mail["id"],
                from_=mail["from"],
                to=mail["to"],
                subject=mail["subject"],
                snippet=mail["snippet"],
                emotion=mail.get("emotion", "neutral"),
            )
            for mail in all_mails
            if mail.get("to") == request.email
        ]

        return user_mails

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール取得エラー: {str(e)}")

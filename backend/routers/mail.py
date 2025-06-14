from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List
import os

from backend.gmail_utils import fetch_and_cache_emails, load_cached_emails, get_token_path
from backend.emotion_analysis import tag_emotion_entries

router = APIRouter(tags=["Mail"])

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
        emails = load_cached_emails()
        tagged = tag_emotion_entries(emails)

        filtered = [
            Mail(**e)
            for e in tagged
            if request.email in e.get("to", "")
        ]

        return filtered
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール一覧取得失敗: {str(e)}")

@router.post("/fetch")
def fetch_mails(mail_request: MailRequest):
    try:
        # ✅ ここを修正
        token_path = get_token_path(mail_request.email)
        if not os.path.exists(token_path):
            raise HTTPException(status_code=400, detail="Gmail認証トークンが存在しません")

        fetched_count = fetch_and_cache_emails(user_email=mail_request.email)
        return {"status": "success", "fetched": fetched_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール取得エラー: {str(e)}")

@router.get("/detail/{mail_id}")
def get_mail_detail(mail_id: str):
    try:
        emails = load_cached_emails()
        for mail in emails:
            if str(mail["id"]) == str(mail_id):
                return {
                    "id": mail["id"],
                    "from_": mail["from_"],
                    "subject": mail["subject"],
                    "body": mail.get("body") or mail.get("snippet", ""),
                    "date": mail.get("date", ""),
                }
        raise HTTPException(status_code=404, detail="対象メールが見つかりませんでした")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"詳細取得失敗: {str(e)}")

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List
import os
import base64
from email.mime.text import MIMEText

from backend.gmail_utils import (
    fetch_and_cache_emails, load_cached_emails, get_token_path, 
    get_gmail_service, create_mime_message
)
from backend.emotion_analysis import tag_emotion_entries

router = APIRouter(tags=["Mail"])

# ========================================
# Pydantic Models
# ========================================

class Mail(BaseModel):
    id: str
    from_: str
    to: str
    subject: str
    snippet: str
    emotion: str = "neutral"
    spam_score: int = 0

class MailRequest(BaseModel):
    email: str

class ReplySendRequest(BaseModel):
    to: str
    cc: str = ""
    bcc: str = ""
    body: str

class ForwardSendRequest(BaseModel):
    to: str
    cc: str = ""
    bcc: str = ""

# ========================================
# 受信一覧
# ========================================

@router.post("/list", response_model=List[Mail])
def list_mails(request: MailRequest):
    try:
        emails = load_cached_emails()
        tagged = tag_emotion_entries(emails)
        filtered = [Mail(**e) for e in tagged if request.email in e.get("to", "")]
        return filtered
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール一覧取得失敗: {str(e)}")

# ========================================
# Gmail取得＆キャッシュ更新
# ========================================

@router.post("/fetch")
def fetch_mails(mail_request: MailRequest):
    try:
        token_path = get_token_path(mail_request.email)
        if not os.path.exists(token_path):
            raise HTTPException(status_code=400, detail="Gmail認証トークンが存在しません")

        fetched_count = fetch_and_cache_emails(user_email=mail_request.email)
        return {"status": "success", "fetched": fetched_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール取得エラー: {str(e)}")

# ========================================
# メール詳細取得
# ========================================

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

# ========================================
# 返信API
# ========================================

@router.post("/reply/{mail_id}")
def send_reply(mail_id: str, request: Request, req: ReplySendRequest):
    try:
        user_email = request.headers.get("X-User-Email")
        if not user_email:
            raise HTTPException(status_code=400, detail="User email missing")

        service = get_gmail_service(user_email=user_email)
        msg_detail = service.users().messages().get(userId='me', id=mail_id, format='metadata').execute()
        headers = msg_detail.get("payload", {}).get("headers", [])
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")

        full_subject = f"Re: {subject}"
        raw_message = create_mime_message(user_email, req.to, req.cc, req.bcc, full_subject, req.body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()

        return {"status": "success", "message": "返信送信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"返信失敗: {e}")

# ========================================
# 転送API
# ========================================

@router.post("/forward/{mail_id}")
def send_forward(mail_id: str, request: Request, req: ForwardSendRequest):
    try:
        user_email = request.headers.get("X-User-Email")
        if not user_email:
            raise HTTPException(status_code=400, detail="User email missing")

        service = get_gmail_service(user_email=user_email)
        msg_detail = service.users().messages().get(userId='me', id=mail_id, format='full').execute()
        payload = msg_detail.get("payload", {})
        headers = payload.get("headers", [])
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")
        from_sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "")
        snippet = msg_detail.get("snippet", "")

        forward_body = f"----- 転送元: {from_sender} -----\n\n{snippet}"
        full_subject = f"FWD: {subject}"
        raw_message = create_mime_message(user_email, req.to, req.cc, req.bcc, full_subject, forward_body)

        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "転送送信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"転送失敗: {e}")

# ========================================
# ✅ 安定版：削除API (trash対応)
# ========================================

@router.delete("/delete/{mail_id}")
def delete_mail(mail_id: str, request: Request):
    try:
        user_email = request.headers.get("X-User-Email")
        if not user_email:
            raise HTTPException(status_code=400, detail="User email missing")

        service = get_gmail_service(user_email=user_email)
        service.users().messages().trash(userId="me", id=mail_id).execute()  # ← ★ trash() に変更！

        # 削除後にキャッシュ更新
        fetch_and_cache_emails(user_email)

        return {"status": "success", "message": f"Mail {mail_id} moved to Trash."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"削除失敗: {e}")

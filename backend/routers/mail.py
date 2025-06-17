from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List
import os

from backend.gmail_utils import (
    fetch_and_cache_emails, load_cached_emails, get_token_path,
    get_gmail_service, create_mime_message
)

router = APIRouter(tags=["Mail"])

### Pydantic models
class Mail(BaseModel):
    id: str
    from_: str
    to: str
    subject: str
    snippet: str
    spam_score: int = 0

class MailRequest(BaseModel):
    email: str

class SendRequest(BaseModel):
    user_email: str
    to: str
    cc: str = ""
    bcc: str = ""
    subject: str
    body: str

class ReplySendRequest(BaseModel):
    to: str
    cc: str = ""
    bcc: str = ""
    body: str

class ForwardSendRequest(BaseModel):
    to: str
    cc: str = ""
    bcc: str = ""


### ===================================
### 新規送信API (今回追加部分)
### ===================================

@router.post("/send")
def send_mail(req: SendRequest):
    try:
        check_token_exists(req.user_email)
        service = get_gmail_service(req.user_email)
        raw_message = create_mime_message(req.user_email, req.to, req.cc, req.bcc, req.subject, req.body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "送信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 各フォルダの共通キャッシュ取得API
### ===================================

@router.post("/list", response_model=List[Mail])
def list_inbox(request: MailRequest):
    return _list_common("inbox", request.email, lambda e: request.email in e.get("to", ""))

@router.post("/list_sent", response_model=List[Mail])
def list_sent(request: MailRequest):
    return _list_common("sent", request.email, lambda e: request.email in e.get("from_", ""))

@router.post("/list_trash", response_model=List[Mail])
def list_trash(request: MailRequest):
    return _list_common("trash", request.email, lambda e: "labels" in e and "TRASH" in e["labels"])


def _list_common(mode: str, user_email: str, filter_fn):
    try:
        emails = load_cached_emails(mode)
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 各フォルダの共通fetch更新API
### ===================================

@router.post("/fetch")
def fetch_inbox(mail_request: MailRequest):
    return _fetch_common(mail_request.email, "inbox")

@router.post("/fetch_sent")
def fetch_sent(mail_request: MailRequest):
    return _fetch_common(mail_request.email, "sent")

@router.post("/fetch_trash")
def fetch_trash(mail_request: MailRequest):
    return _fetch_common(mail_request.email, "trash")

def _fetch_common(email: str, mode: str):
    try:
        check_token_exists(email)
        count = fetch_and_cache_emails(email, mode=mode)
        return {"status": "success", "fetched": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### メール詳細取得（全キャッシュ検索）
### ===================================

@router.get("/detail/{mail_id}")
def get_mail_detail(mail_id: str):
    try:
        for mode in ["inbox", "sent", "trash"]:
            emails = load_cached_emails(mode)
            for mail in emails:
                if mail["id"] == mail_id:
                    return {
                        "id": mail["id"],
                        "from_": mail["from_"],
                        "subject": mail["subject"],
                        "body": mail.get("body") or mail.get("snippet", ""),
                        "date": mail.get("date", ""),
                    }
        raise HTTPException(status_code=404, detail="対象メールが見つかりません")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 返信API
### ===================================

@router.post("/reply/{mail_id}")
def reply_mail(mail_id: str, request: Request, req: ReplySendRequest):
    try:
        user_email = get_user_email(request)
        service = get_gmail_service(user_email)
        msg = service.users().messages().get(userId='me', id=mail_id, format='metadata').execute()
        subject = next((h['value'] for h in msg.get("payload", {}).get("headers", [])
                        if h['name'].lower() == 'subject'), "(No Subject)")
        full_subject = f"Re: {subject}"
        raw_message = create_mime_message(user_email, req.to, req.cc, req.bcc, full_subject, req.body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "返信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 転送API
### ===================================

@router.post("/forward/{mail_id}")
def forward_mail(mail_id: str, request: Request, req: ForwardSendRequest):
    try:
        user_email = get_user_email(request)
        service = get_gmail_service(user_email)
        msg = service.users().messages().get(userId='me', id=mail_id, format='full').execute()
        headers = msg.get("payload", {}).get("headers", [])
        snippet = msg.get("snippet", "")
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")
        from_sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "")
        forward_body = f"----- 転送元: {from_sender} -----\n\n{snippet}"
        full_subject = f"FWD: {subject}"
        raw_message = create_mime_message(user_email, req.to, req.cc, req.bcc, full_subject, forward_body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "転送完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 削除API (ゴミ箱へ移動)
### ===================================

@router.delete("/delete/{mail_id}")
def delete_mail(mail_id: str, request: Request):
    try:
        user_email = get_user_email(request)
        service = get_gmail_service(user_email)
        service.users().messages().trash(userId="me", id=mail_id).execute()
        fetch_and_cache_emails(user_email, mode="inbox")
        return {"status": "success", "message": "ゴミ箱に移動しました"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### ヘルパー関数群
### ===================================

def check_token_exists(email: str):
    token_path = get_token_path(email)
    if not os.path.exists(token_path):
        raise HTTPException(status_code=400, detail="Gmail認証トークンが存在しません")

def get_user_email(request: Request) -> str:
    user_email = request.headers.get("X-User-Email")
    if not user_email:
        raise HTTPException(status_code=400, detail="User email missing")
    return user_email

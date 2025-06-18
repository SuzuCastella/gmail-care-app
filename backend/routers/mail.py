from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import os

from backend.gmail_utils import (
    fetch_and_cache_emails, load_cached_emails, get_token_path,
    get_gmail_service, create_mime_message
)
from backend.utils.auth_utils import get_current_user
from backend.schemas.user import UserInDB

router = APIRouter(tags=["Mail"])

### Pydantic models
class Mail(BaseModel):
    id: str
    from_: str
    to: str
    subject: str
    snippet: str
    spam_score: int = 0

class SendRequest(BaseModel):
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
### 新規送信API
### ===================================

@router.post("/send")
def send_mail(req: SendRequest, user: UserInDB = Depends(get_current_user)):
    try:
        check_token_exists(user.email)
        service = get_gmail_service(user.email)
        raw_message = create_mime_message(user.email, req.to, req.cc, req.bcc, req.subject, req.body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "送信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

### ===================================
### 各フォルダの共通キャッシュ取得API
### ===================================

@router.post("/list", response_model=List[Mail])
def list_inbox(user: UserInDB = Depends(get_current_user)):
    return _list_common("inbox", user.email, lambda e: user.email in e.get("to", ""))

@router.post("/list_sent", response_model=List[Mail])
def list_sent(user: UserInDB = Depends(get_current_user)):
    return _list_common("sent", user.email, lambda e: user.email in e.get("from_", ""))

@router.post("/list_trash", response_model=List[Mail])
def list_trash(user: UserInDB = Depends(get_current_user)):
    return _list_common("trash", user.email, lambda e: "labels" in e and "TRASH" in e["labels"])

def _list_common(mode: str, user_email: str, filter_fn):
    try:
        emails = load_cached_emails(mode)
        filtered = list(filter(filter_fn, emails))  # ← ここが必要！！
        return filtered
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 各フォルダの共通fetch更新API
### ===================================

@router.post("/fetch")
def fetch_inbox(user: UserInDB = Depends(get_current_user)):
    return _fetch_common(user.email, "inbox")

@router.post("/fetch_sent")
def fetch_sent(user: UserInDB = Depends(get_current_user)):
    return _fetch_common(user.email, "sent")

@router.post("/fetch_trash")
def fetch_trash(user: UserInDB = Depends(get_current_user)):
    return _fetch_common(user.email, "trash")

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
def get_mail_detail(mail_id: str, user: UserInDB = Depends(get_current_user)):
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
def reply_mail(mail_id: str, req: ReplySendRequest, user: UserInDB = Depends(get_current_user)):
    try:
        service = get_gmail_service(user.email)
        msg = service.users().messages().get(userId='me', id=mail_id, format='metadata').execute()
        subject = next((h['value'] for h in msg.get("payload", {}).get("headers", [])
                        if h['name'].lower() == 'subject'), "(No Subject)")
        full_subject = f"Re: {subject}"
        raw_message = create_mime_message(user.email, req.to, req.cc, req.bcc, full_subject, req.body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "返信完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 転送API
### ===================================

@router.post("/forward/{mail_id}")
def forward_mail(mail_id: str, req: ForwardSendRequest, user: UserInDB = Depends(get_current_user)):
    try:
        service = get_gmail_service(user.email)
        msg = service.users().messages().get(userId='me', id=mail_id, format='full').execute()
        headers = msg.get("payload", {}).get("headers", [])
        snippet = msg.get("snippet", "")
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")
        from_sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "")
        forward_body = f"----- 転送元: {from_sender} -----\n\n{snippet}"
        full_subject = f"FWD: {subject}"
        raw_message = create_mime_message(user.email, req.to, req.cc, req.bcc, full_subject, forward_body)
        service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        return {"status": "success", "message": "転送完了"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


### ===================================
### 削除API (ゴミ箱へ移動)
### ===================================

@router.delete("/delete/{mail_id}")
def delete_mail(mail_id: str, user: UserInDB = Depends(get_current_user)):
    try:
        service = get_gmail_service(user.email)
        service.users().messages().trash(userId="me", id=mail_id).execute()
        fetch_and_cache_emails(user.email, mode="inbox")
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

import os
import json
import base64
from pathlib import Path
from typing import List
from email.mime.text import MIMEText
import html
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from dotenv import load_dotenv
from backend.gpt_utils import detect_spam_score

load_dotenv()

# Gmailスコープ（取得・送信・削除までカバー）
SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
]

BASE_DIR = Path(__file__).resolve().parent.parent
CREDENTIALS_PATH = BASE_DIR / "backend" / "credentials.json"
TOKEN_DIR = BASE_DIR / "backend" / "token_store"
CACHE_DIR = BASE_DIR / "data" / "cache"
TOKEN_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)

### ========================
### パス系ユーティリティ
### ========================

def get_token_path(email: str) -> Path:
    safe_email = email.replace("@", "_at_").replace(".", "_dot_")
    return TOKEN_DIR / f"token_{safe_email}.json"

def get_cache_path(mode: str) -> Path:
    return CACHE_DIR / f"mail_cache_{mode}.json"

### ========================
### Gmail APIサービス作成
### ========================

def get_gmail_service(user_email: str) -> object:
    token_path = get_token_path(user_email)
    creds = None

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
            creds = flow.run_local_server(port=8080)
        with open(token_path, 'w') as token_file:
            token_file.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

### ========================
### メール取得＆キャッシュ
### ========================

def fetch_and_cache_emails(user_email: str, mode: str, max_results: int = 50) -> int:
    service = get_gmail_service(user_email)

    label_map = {
        "inbox": ["INBOX"],
        "sent": ["SENT"],
        "trash": ["TRASH"]
    }
    label_ids = label_map.get(mode, [])

    results = service.users().messages().list(
        userId='me',
        labelIds=label_ids,
        maxResults=max_results
    ).execute()

    messages = results.get('messages', [])

    emails = []
    for msg in messages:
        msg_detail = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
        payload = msg_detail.get("payload", {})
        headers = payload.get("headers", [])
        snippet = msg_detail.get("snippet", "")
        labels = msg_detail.get("labelIds", [])

        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")
        sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "(Unknown Sender)")
        recipient = next((h['value'] for h in headers if h['name'].lower() == 'to'), user_email)
        date = next((h['value'] for h in headers if h['name'].lower() == 'date'), "(No Date)")
        raw_body = extract_plain_text(payload)
        body = html.escape(raw_body).replace("\n", "<br>")

        spam_input = f"{subject}\n{raw_body}"
        if len(spam_input) > 1000:
            spam_input = spam_input[:1000]
        spam_score = detect_spam_score(spam_input)

        emails.append({
            "id": msg['id'],
            "from_": sender,
            "to": recipient,
            "subject": subject,
            "snippet": snippet,
            "date": date,
            "body": body,
            "spam_score": spam_score,
            "labels": labels
        })

    cache_path = get_cache_path(mode)
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(emails, f, ensure_ascii=False, indent=2)

    return len(emails)

def load_cached_emails(mode: str) -> List[dict]:
    cache_path = get_cache_path(mode)
    if not cache_path.exists():
        return []
    with open(cache_path, "r", encoding="utf-8") as f:
        return json.load(f)

### ========================
### 本文抽出（text/plain優先）
### ========================

def extract_plain_text(payload: dict) -> str:
    if "parts" in payload:
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain":
                data = part.get("body", {}).get("data", "")
                if data:
                    return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
            elif part.get("parts"):  
                text = extract_plain_text(part)
                if text:
                    return text
    else:
        data = payload.get("body", {}).get("data", "")
        if data:
            return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
    return ""

### ========================
### 送信用MIME生成
### ========================

def create_mime_message(sender: str, to: str, cc: str, bcc: str, subject: str, body: str) -> str:
    message = MIMEText(body, "plain", "utf-8")
    message["From"] = sender
    message["To"] = to
    if cc:
        message["Cc"] = cc
    if bcc:
        message["Bcc"] = bcc
    message["Subject"] = subject

    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return raw_message

### ========================
### 送信処理
### ========================

def send_gmail_actual(user_email: str, to: str, cc: str, bcc: str, subject: str, body: str):
    service = get_gmail_service(user_email)
    raw_message = create_mime_message(user_email, to, cc, bcc, subject, body)
    service.users().messages().send(userId="me", body={"raw": raw_message}).execute()

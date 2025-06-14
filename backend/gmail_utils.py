import os
import json
import base64
from pathlib import Path
from typing import List

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from dotenv import load_dotenv
load_dotenv()

# スコープとパス定義
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
CREDENTIALS_PATH = Path("backend/credentials.json")
CACHE_PATH = Path("data/mail_cache.json")
TOKEN_DIR = Path("backend/token_store")
TOKEN_DIR.mkdir(parents=True, exist_ok=True)

def get_token_path(email: str) -> Path:
    safe_email = email.replace("@", "_at_").replace(".", "_dot_")
    return TOKEN_DIR / f"token_{safe_email}.json"

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

def extract_plain_text(payload: dict) -> str:
    if "parts" in payload:
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain":
                data = part.get("body", {}).get("data", "")
                return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
    else:
        data = payload.get("body", {}).get("data", "")
        if data:
            return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
    return ""

def fetch_and_cache_emails(user_email: str, max_results: int = 20) -> int:
    service = get_gmail_service(user_email)
    results = service.users().messages().list(userId='me', maxResults=max_results).execute()
    messages = results.get('messages', [])

    emails = []
    for msg in messages:
        msg_detail = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
        payload = msg_detail.get("payload", {})
        headers = payload.get("headers", [])
        snippet = msg_detail.get("snippet", "")

        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "(No Subject)")
        sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "(Unknown Sender)")
        recipient = next((h['value'] for h in headers if h['name'].lower() == 'to'), user_email)
        date = next((h['value'] for h in headers if h['name'].lower() == 'date'), "(No Date)")
        body = extract_plain_text(payload)

        emails.append({
            "id": msg['id'],
            "from_": sender,
            "to": recipient,
            "subject": subject,
            "snippet": snippet,
            "date": date,
            "body": body
        })

    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(emails, f, ensure_ascii=False, indent=2)

    return len(emails)

def load_cached_emails() -> List[dict]:
    if not CACHE_PATH.exists():
        return []
    with open(CACHE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

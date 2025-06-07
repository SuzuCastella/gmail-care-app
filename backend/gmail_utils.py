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

# Gmail APIのスコープ
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# 認証ファイル
CREDENTIALS_PATH = Path("backend/credentials.json")
TOKEN_PATH = Path(os.getenv("TOKEN_PATH", "backend/token.json"))
CACHE_PATH = Path("data/mail_cache.json")


def get_gmail_service():
    """
    OAuth2を使ってGmailサービスを取得
    """
    creds = None

    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
            creds = flow.run_local_server(port=8080)  # ★ ポートを固定する
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)
    return service


def extract_plain_text(payload: dict) -> str:
    """
    メールの本文（text/plain）を抽出
    """
    if "parts" in payload:
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain":
                data = part.get("body", {}).get("data", "")
                return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
    else:
        # multipart でない場合
        data = payload.get("body", {}).get("data", "")
        if data:
            return base64.urlsafe_b64decode(data.encode()).decode("utf-8", errors="ignore")
    return ""


def fetch_and_cache_emails(max_results: int = 20) -> int:
    """
    Gmailからメールを取得し、本文・日付付きでキャッシュ保存
    """
    service = get_gmail_service()
    results = service.users().messages().list(userId='me', maxResults=max_results).execute()
    messages = results.get('messages', [])

    emails = []
    for msg in messages:
        msg_detail = service.users().messages().get(
            userId='me',
            id=msg['id'],
            format='full'  # ← 本文含む
        ).execute()

        payload = msg_detail.get("payload", {})
        headers = payload.get("headers", [])
        snippet = msg_detail.get("snippet", "")

        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "(No Subject)")
        sender = next((h['value'] for h in headers if h['name'] == 'From'), "(Unknown Sender)")
        date = next((h['value'] for h in headers if h['name'] == 'Date'), "(No Date)")

        body = extract_plain_text(payload)

        emails.append({
            "id": msg['id'],
            "from": sender,
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
    """
    ローカルに保存されたメールを読み込む
    """
    if not CACHE_PATH.exists():
        return []
    with open(CACHE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
import os
import json
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



def fetch_and_cache_emails(max_results: int = 20) -> int:
    """
    Gmailからメールを取得し、JSONとして保存
    """
    service = get_gmail_service()
    results = service.users().messages().list(userId='me', maxResults=max_results).execute()
    messages = results.get('messages', [])

    emails = []
    for msg in messages:
        msg_detail = service.users().messages().get(userId='me', id=msg['id'], format='metadata').execute()
        headers = msg_detail.get("payload", {}).get("headers", [])
        snippet = msg_detail.get("snippet", "")
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "(No Subject)")
        sender = next((h['value'] for h in headers if h['name'] == 'From'), "(Unknown Sender)")

        emails.append({
            "id": msg['id'],
            "from": sender,
            "subject": subject,
            "snippet": snippet,
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

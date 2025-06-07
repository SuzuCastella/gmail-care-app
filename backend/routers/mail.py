from fastapi import APIRouter, HTTPException
from backend.gmail_utils import fetch_and_cache_emails, load_cached_emails

router = APIRouter()


@router.get("/list")
def get_cached_emails():
    """
    キャッシュされた全メールを取得
    """
    try:
        emails = load_cached_emails()
        return {"status": "success", "emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load emails: {str(e)}")


@router.post("/fetch")
def fetch_emails():
    """
    Gmail APIから最新メールを取得してキャッシュ保存
    """
    try:
        fetched_count = fetch_and_cache_emails()
        return {"status": "success", "fetched": fetched_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail fetch error: {str(e)}")


@router.get("/{mail_id}")
def get_mail_by_id(mail_id: str):
    """
    メールIDを指定して1件のメール詳細を取得
    """
    try:
        emails = load_cached_emails()
        for mail in emails:
            if mail.get("id") == mail_id:
                return {"status": "success", "mail": mail}
        raise HTTPException(status_code=404, detail="指定されたメールが見つかりません")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール取得エラー: {str(e)}")

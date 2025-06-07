from fastapi import APIRouter, HTTPException
from backend.gmail_utils import fetch_and_cache_emails, load_cached_emails

router = APIRouter()

@router.get("/list")
def get_cached_emails():
    """
    キャッシュ済みのメール一覧を取得
    """
    try:
        emails = load_cached_emails()
        return {"status": "success", "emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load emails: {str(e)}")


@router.post("/fetch")
def fetch_emails():
    """
    Gmailからメールを取得し、キャッシュを更新
    """
    try:
        fetched_count = fetch_and_cache_emails()
        return {"status": "success", "fetched": fetched_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail fetch error: {str(e)}")

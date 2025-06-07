from fastapi import APIRouter, Request, HTTPException
from backend.emotion_analysis import analyze_emotion, tag_emotion_entries
from backend.gmail_utils import load_cached_emails

router = APIRouter()

@router.post("/analyze")
async def analyze_emotion_api(request: Request):
    """
    単一のメール本文に対して感情分類を行う
    """
    try:
        data = await request.json()
        text = data.get("text", "")
        if not text:
            raise ValueError("textフィールドが空です")

        emotion = analyze_emotion(text)
        return {"status": "success", "emotion": emotion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"感情分類エラー: {e}")


@router.get("/tagged-list")
def get_emotion_tagged_emails():
    """
    キャッシュ済みメールに感情ラベルを付けて返す（思い出帳用）
    """
    try:
        emails = load_cached_emails()
        tagged_emails = tag_emotion_entries(emails)
        return {"status": "success", "emails": tagged_emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"感情付きメール取得エラー: {e}")


@router.get("/sample")
def get_emotion_sample():
    """
    サンプルメールに対して感情分類（デモ用）
    """
    sample = "先日はお祝いのメッセージをありがとうございました。とても嬉しかったです。"
    result = analyze_emotion(sample)
    return {"sample": sample, "emotion": result}

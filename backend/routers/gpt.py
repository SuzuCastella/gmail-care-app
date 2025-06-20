from fastapi import APIRouter, HTTPException, Request
from backend.gpt_utils import summarize_and_simplify

router = APIRouter(prefix="/gpt", tags=["GPT"])

@router.post("/summarize")
async def summarize_text(request: Request):
    """
    メール本文をやさしい日本語で要約して返す
    """
    try:
        data = await request.json()
        text = data.get("text", "")
        if not text:
            raise ValueError("text フィールドが空です")

        summary = summarize_and_simplify(text)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"要約エラー: {e}")

from fastapi import APIRouter, HTTPException, Request
from backend.gpt_utils import generate_polite_reply

router = APIRouter()

@router.post("/generate")
async def generate_reply(request: Request):
    """
    メール本文に対して丁寧な返信文をGPTで生成する
    """
    try:
        data = await request.json()
        text = data.get("text", "")
        if not text:
            raise ValueError("textフィールドが空です")

        reply = generate_polite_reply(text)
        return {"status": "success", "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"返信文生成に失敗しました: {e}")


@router.get("/sample")
def get_sample_reply():
    """
    簡単なデモ用：固定文に対してサンプル返信を生成
    """
    dummy_text = "先日はお忙しい中、会議にご参加いただきありがとうございました。"
    reply = generate_polite_reply(dummy_text)
    return {"original": dummy_text, "reply": reply}

# backend/routers/kotori.py

from fastapi import APIRouter, HTTPException, Request
from backend.gpt_utils import call_gpt_api 

router = APIRouter(prefix="/kotori", tags=["kotori"])

@router.post("/chat")
async def chat_with_kotori(request: Request):
    """
    ことりボットとの会話：メッセージを受け取り、GPT応答を返す
    """
    try:
        data = await request.json()
        message = data.get("message", "").strip()

        if not message:
            raise ValueError("messageが空です")

        prompt = (
            "あなたは「ことり」という親しみやすいAIアシスタントです。\n"
            "やさしく、励ましながら返答してください。\n"
            "以下がユーザーからの入力です：\n\n"
            f"{message}\n\n"
            "ことりの返答："
        )

        reply = call_gpt_api(prompt)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ことり応答に失敗しました: {e}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ルーターをインポート
from backend.routers import (
    mail,
    reply,
    voice,
    gpt,
    emotion,
    kotori,
    auth
)

app = FastAPI(
    title="Gmail Care App API",
    description="FUMI",
    version="1.0.0"
)

# CORS設定（フロントエンドとの通信許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React開発サーバー
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 各ルーターを登録
app.include_router(mail.router, prefix="/mail", tags=["Mail"])
app.include_router(reply.router, prefix="/reply", tags=["Reply"])
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
app.include_router(gpt.router, prefix="/gpt", tags=["GPT"])
app.include_router(emotion.router, prefix="/emotion", tags=["Emotion"])
app.include_router(kotori.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])  # ✅ authルーターを追加

@app.get("/")
def read_root():
    return {"message": "Gmail Care App API is running"}
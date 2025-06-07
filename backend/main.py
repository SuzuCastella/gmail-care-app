from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ルーターをインポート
from backend.routers import mail, reply, voice, gpt, emotion

app = FastAPI(
    title="Gmail Care App API",
    description="高齢者向けGmail支援アプリのAPI",
    version="1.0.0"
)

# CORS（フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React開発用ポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 各ルーターを登録
app.include_router(mail.router, prefix="/mail", tags=["Mail"])
app.include_router(reply.router, prefix="/reply", tags=["Reply"])
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
app.include_router(gpt.router, prefix="/gpt", tags=["GPT"])           # ✅ 追加
app.include_router(emotion.router, prefix="/emotion", tags=["Emotion"])  # ✅ 追加

@app.get("/")
def read_root():
    return {"message": "Gmail Care App API is running"}

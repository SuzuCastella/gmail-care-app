from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔹 テーブル自動作成に必要な import を追加
from backend.db import Base, engine
from backend.models import user, draft, kotori_diary

# 🔹 初回起動時にテーブル作成（既に存在すれば何もしない）
Base.metadata.create_all(bind=engine)

# ルーターをインポート
from backend.routers import (
    mail,
    reply,
    voice,
    gpt,
    kotori,
    auth,
    draft,
    user as user_router,
    gpt_router,
    kotori_diary
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
app.include_router(kotori.router)
app.include_router(auth.router)
app.include_router(draft.router)
app.include_router(user_router.router)
app.include_router(gpt_router.router)
app.include_router(kotori_diary.router)

@app.get("/")
def read_root():
    return {"message": "Gmail Care App API is running"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
import json
import os

from backend.db import get_db
from backend.models.kotori_diary import KotoriDiary, KotoriPoint, KotoriFamilyEmail
from backend.models.user import User
from backend.gmail_utils import send_gmail_actual

router = APIRouter(prefix="/kotori-diary", tags=["kotori_diary"])

# ✅ Pydanticスキーマ定義
class DiaryRequest(BaseModel):
    user_email: str
    condition: str
    sleep_hours: int
    condition_detail: str
    diary_text: str

class FamilyRegisterRequest(BaseModel):
    user_email: str
    family_email: str

class FamilyGetRequest(BaseModel):
    user_email: str

# ✅ 迷惑メール件数カウント（ここが新規）
def count_spam_today(user_email: str, date: datetime.date, threshold: float = 0.8) -> int:
    try:
        cache_path = "data/cache/mail_cache_inbox.json"
        if not os.path.exists(cache_path):
            return 0

        with open(cache_path, "r", encoding="utf-8") as f:
            mails = json.load(f)

        count = 0
        for mail in mails:
            try:
                mail_date = datetime.strptime(mail["date"], "%a, %d %b %Y %H:%M:%S %z").date()
                if mail_date == date:
                    spam_score = mail.get("spam_score", 0)
                    if spam_score > threshold:
                        count += 1
            except:
                continue  # 万が一日付パース失敗しても無視
        return count
    except Exception as e:
        print(f"迷惑メールカウントエラー: {e}")
        return 0

# ✅ 日記の新規登録
@router.post("/add")
def add_diary(payload: DiaryRequest, db: Session = Depends(get_db)):
    diary = KotoriDiary(
        user_email=payload.user_email,
        date=datetime.now(),
        condition=payload.condition,
        sleep_hours=payload.sleep_hours,
        condition_detail=payload.condition_detail,
        diary_text=payload.diary_text
    )
    db.add(diary)

    point_obj = db.query(KotoriPoint).filter(KotoriPoint.user_email == payload.user_email).first()
    if point_obj:
        point_obj.point += 1
    else:
        db.add(KotoriPoint(user_email=payload.user_email, point=1))

    db.commit()

    send_summary_to_family(payload.user_email, db)
    return {"message": "日記を保存しました"}

# ✅ ポイント取得API
@router.get("/point")
def get_point(user_email: str, db: Session = Depends(get_db)):
    point_obj = db.query(KotoriPoint).filter(KotoriPoint.user_email == user_email).first()
    point = point_obj.point if point_obj else 0
    return {"point": point}

# ✅ 日記一覧取得API
@router.get("/list")
def get_diary_list(user_email: str, db: Session = Depends(get_db)):
    diaries = db.query(KotoriDiary).filter(KotoriDiary.user_email == user_email).order_by(KotoriDiary.date.desc()).all()
    result = [
        {
            "date": d.date.strftime("%Y-%m-%d"),
            "condition": d.condition,
            "sleep_hours": d.sleep_hours,
            "condition_detail": d.condition_detail,
            "diary_text": d.diary_text,
        } for d in diaries
    ]
    return result

# ✅ 家族メール登録
@router.post("/family/register")
def register_family(payload: FamilyRegisterRequest, db: Session = Depends(get_db)):
    user_email = payload.user_email
    family_email = payload.family_email

    existing = db.query(KotoriFamilyEmail).filter(KotoriFamilyEmail.user_email == user_email).first()
    if existing:
        existing.family_email = family_email
    else:
        db.add(KotoriFamilyEmail(user_email=user_email, family_email=family_email))
    db.commit()
    return {"message": "家族のメールアドレスを登録しました"}

# ✅ 家族メール取得API
@router.get("/family/get")
def get_family(user_email: str, db: Session = Depends(get_db)):
    existing = db.query(KotoriFamilyEmail).filter(KotoriFamilyEmail.user_email == user_email).first()
    return {"family_email": existing.family_email if existing else None}

# ✅ サマリー送信（迷惑メール件数も追加）
def send_summary_to_family(user_email: str, db: Session):
    user = db.query(User).filter(User.email == user_email).first()
    family = db.query(KotoriFamilyEmail).filter(KotoriFamilyEmail.user_email == user_email).first()
    if not (user and family):
        return

    today = datetime.now().date()
    today_diary = db.query(KotoriDiary).filter(
        KotoriDiary.user_email == user_email,
        KotoriDiary.date >= datetime(today.year, today.month, today.day)
    ).first()

    if not today_diary:
        return

    spam_count = count_spam_today(user_email, today)

    subject = f"【メールアプリFUMI -ことり日記サービス-】{user.name}様の本日のご報告"
    body = (
        f"平素よりメールアプリFUMIをご利用いただきまして、ありがとうございます。本日の{user.name}様のことり日記のご連絡です。\n\n"
        f"体調：{today_diary.condition}\n"
        f"睡眠時間：{today_diary.sleep_hours}時間\n"
        f"その他の体調：{today_diary.condition_detail}\n"
        f"ひとこと日記：{today_diary.diary_text}\n"
        f"迷惑メール件数：{spam_count}件\n\n"
        f"※このメールは自動送信されています。\n"
        f"※本機能は{user.name}様の承諾を得てお送りしております。"
    )

    send_gmail_actual(user_email, family.family_email, "", "", subject, body)

@router.get("/today/check")
def check_today_diary(user_email: str, db: Session = Depends(get_db)):
    #today = datetime.now().date()
    #today_diary = db.query(KotoriDiary).filter(
    #    KotoriDiary.user_email == user_email,
    #    KotoriDiary.date >= datetime(today.year, today.month, today.day)
    #).first()
    today_diary = None

    return {"registered": today_diary is not None}

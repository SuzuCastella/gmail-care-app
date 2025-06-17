from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.models import Base

class KotoriDiary(Base):
    __tablename__ = "kotori_diary"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), index=True)
    date = Column(DateTime, default=datetime.utcnow)
    condition = Column(String(20))  # 大変良好・良好・普通・悪い・大変悪い
    sleep_hours = Column(Integer)  # 睡眠時間（時間単位）
    condition_detail = Column(Text)  # その他の体調状況
    diary_text = Column(Text)  # ひとこと日記

class KotoriFamilyEmail(Base):
    __tablename__ = "kotori_family_email"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), index=True)
    family_email = Column(String(255))  # 家族宛先メールアドレス

class KotoriPoint(Base):
    __tablename__ = "kotori_point"

    user_email = Column(String(255), primary_key=True, index=True)
    point = Column(Integer, default=0)

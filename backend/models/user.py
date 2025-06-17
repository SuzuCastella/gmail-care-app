from sqlalchemy import Column, Integer, String, Boolean
from backend.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    name_kana = Column(String(100), nullable=False)
    icon = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    kotori_enabled = Column(Boolean, default=True)

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class DraftBase(BaseModel):
    to: EmailStr
    cc: Optional[str] = None
    bcc: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None

    class Config:
        orm_mode = True

class DraftCreate(DraftBase):
    user_email: EmailStr

class DraftInDB(DraftBase):
    id: int
    user_email: EmailStr
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

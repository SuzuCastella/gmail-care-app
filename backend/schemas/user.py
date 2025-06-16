from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    name_kana: str
    icon: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    email: str
    name: str
    name_kana: str
    icon: str

    model_config = ConfigDict(from_attributes=True)

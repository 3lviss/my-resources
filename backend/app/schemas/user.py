from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr


class UserLogin(BaseModel):
    email: EmailStr


class UserOut(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

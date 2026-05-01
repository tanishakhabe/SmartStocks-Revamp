from pydantic import BaseModel, EmailStr
from typing import List, Literal, Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# describes the shape of the JSON returned when you issue auth tokens after login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PreferencesUpdate(BaseModel):
    sectors: list[str] = []
    risk_tolerance: str = "medium"       # 'low' | 'medium' | 'high'
    min_price: float = 0
    max_price: float = 10000
    dividend_pref: float = 0.5

class FavoriteAdd(BaseModel):
    ticker: str

class FavoriteResponse(BaseModel):
    ticker: str
    added_at: str
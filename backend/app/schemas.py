from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True # Allow ORM models to be converted to Pydantic models

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User Progress Schemas ---
class UserProgressBase(BaseModel):
    letter: str
    highest_confidence: float
    is_mastered: bool

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressResponse(UserProgressBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Test History Schemas ---
class TestHistoryBase(BaseModel):
    score: float
    total_correct: int
    total_questions: int
    wrong_letters: str # JSON string for now, could be List[str] if handled by backend

class TestHistoryCreate(TestHistoryBase):
    pass

class TestHistoryResponse(TestHistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Prediction Schemas ---
class HandData(BaseModel):
    label: str # 'Left' or 'Right'
    landmarks: list[list[float]] # 21 elements, each [x, y, z]

class LandmarkData(BaseModel):
    hands: list[HandData]

class PredictionResult(BaseModel):
    letter: str
    confidence: float


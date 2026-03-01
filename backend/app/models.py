from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="user")
    test_history = relationship("TestHistory", back_populates="user")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    letter = Column(String(1), nullable=False) # A-Z
    highest_confidence = Column(Float, default=0.0)
    is_mastered = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")

class TestHistory(Base):
    __tablename__ = "test_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float, nullable=False) # Percentage of correct answers
    total_correct = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    wrong_letters = Column(String) # Storing as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="test_history")
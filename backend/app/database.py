from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Use relative import for Base from models.py
# Assuming models.py is in the same directory as database.py
from .models import Base 

# SQLite database URL
DATABASE_URL = "sqlite:///./bisindo.db"

# Create the SQLAlchemy engine
# connect_args={"check_same_thread": False} is needed for SQLite with FastAPI
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class
# This will be the actual database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Function to create all tables
def create_db_and_tables():
    Base.metadata.create_all(engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import os # Added for model path

from .app.database import create_db_and_tables, get_db
from .app import models, schemas, auth
from .app.ai.model import load_bisindo_model, predict_letter # Added AI model imports

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Default Vite port for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI Model Path ---
# Assuming bisindo_model.pth is in backend/app/ai/
MODEL_PATH = os.path.join(os.path.dirname(__file__), "app", "ai", "bisindo_model.pth")

# --- Database Startup Event ---
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Load AI model on startup
    try:
        load_bisindo_model(MODEL_PATH)
    except FileNotFoundError as e:
        print(f"Error loading model: {e}. Please ensure bisindo_model.pth is in backend/app/ai/")
        # Optionally, you might want to exit or disable AI functionality here
    except Exception as e:
        print(f"An unexpected error occurred while loading the AI model: {e}")

# --- Auth Endpoints ---
@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Placeholder Endpoints ---
# --- AI Prediction Endpoint ---
@app.post("/api/predict", response_model=schemas.PredictionResult)
def predict_sign_language(data: schemas.LandmarkData):
    try:
        predicted_letter, confidence = predict_letter(data.landmarks)
        return {"letter": predicted_letter, "confidence": confidence}
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {e}"
        )

@app.get("/api/progress", response_model=list[schemas.UserProgressResponse])
def get_user_progress(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # This will be implemented in Phase 2/3
    user_progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).all()
    return user_progress

@app.post("/api/tests", response_model=schemas.TestHistoryResponse, status_code=status.HTTP_201_CREATED)
def submit_test_results(test_data: schemas.TestHistoryCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # This will be implemented in Phase 5
    db_test_history = models.TestHistory(
        user_id=current_user.id,
        score=test_data.score,
        total_correct=test_data.total_correct,
        total_questions=test_data.total_questions,
        wrong_letters=test_data.wrong_letters # Store as JSON string
    )
    db.add(db_test_history)
    db.commit()
    db.refresh(db_test_history)
    return db_test_history

@app.get("/api/tests", response_model=list[schemas.TestHistoryResponse])
def get_test_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # This will be implemented in Phase 5
    test_history = db.query(models.TestHistory).filter(models.TestHistory.user_id == current_user.id).all()
    return test_history

@app.post("/api/progress", response_model=schemas.UserProgressResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_user_progress(
    progress_data: schemas.UserProgressCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    # This will be implemented in Phase 2/3
    db_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.letter == progress_data.letter
    ).first()

    if db_progress:
        # Update existing progress
        db_progress.highest_confidence = max(db_progress.highest_confidence, progress_data.highest_confidence)
        db_progress.is_mastered = progress_data.is_mastered
    else:
        # Create new progress
        db_progress = models.UserProgress(user_id=current_user.id, **progress_data.model_dump())
        db.add(db_progress)
    
    db.commit()
    db.refresh(db_progress)
    return db_progress


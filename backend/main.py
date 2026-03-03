from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import os
from jose import jwt, JWTError

from app.database import create_db_and_tables, get_db
from app import models, schemas, auth
from app.ai.model import load_bisindo_model, predict_letter 

from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(
    title="BISINDO AI API",
    description="Real-time Sign Language Recognition API powered by PyTorch and MediaPipe",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://bisindo-ai.vercel.app", # Domain Vercel Anda
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI Model Path ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), "app", "ai", "bisindo_model.pth")

# --- Database Startup Event ---
@app.on_event("startup")
def on_startup():
    print("Starting up application...")
    try:
        create_db_and_tables()
        print("Database tables verified/created.")
    except Exception as e:
        print(f"Database connection failed during startup: {e}")
        print("Application will continue to start, but DB features may fail.")
        
    try:
        load_bisindo_model(MODEL_PATH)
        print("AI Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

# --- WebSocket Endpoint for Real-time Prediction ---
@app.websocket("/ws/predict")
async def websocket_predict(websocket: WebSocket, token: str = Query(None)):
    # 1. Authenticate BEFORE accepting the connection
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except JWTError:
        # Deny connection if token is invalid or expired
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # 2. Accept connection only if authenticated
    await websocket.accept()

    # 2. Continuous listening and predicting loop
    try:
        while True:
            # Wait for data from frontend
            try:
                data = await websocket.receive_json()
                hands = data.get("hands", [])
                
                if not hands:
                    # Clear prediction if no hands sent
                    await websocket.send_json({"letter": "Unknown", "confidence": 0.0})
                    continue

                # Predict
                predicted_letter, confidence = predict_letter(hands)
                
                # Send result back immediately
                await websocket.send_json({
                    "letter": predicted_letter, 
                    "confidence": confidence
                })
            except Exception as e:
                print(f"Prediction error: {e}")
                await websocket.send_json({"letter": "Error", "confidence": 0.0, "error": str(e)})
                
    except WebSocketDisconnect:
        print("WebSocket Client disconnected")
    except Exception as e:
        print(f"WebSocket Loop Fatal Error: {e}")

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
        predicted_letter, confidence = predict_letter(data.hands)
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


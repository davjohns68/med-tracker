from datetime import timedelta, datetime, timezone
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import JWTError, jwt

import models, schemas, auth
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Medication Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
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

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/medications/", response_model=schemas.Medication)
def create_medication(medication: schemas.MedicationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_med = models.Medication(**medication.model_dump(), owner_id=current_user.id)
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@app.get("/medications/", response_model=List[schemas.Medication])
def read_medications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    medications = db.query(models.Medication).filter(models.Medication.owner_id == current_user.id).offset(skip).limit(limit).all()
    return medications

@app.post("/medications/{med_id}/take", response_model=schemas.Medication)
def take_medication(med_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    med = db.query(models.Medication).filter(models.Medication.id == med_id, models.Medication.owner_id == current_user.id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    now = datetime.now(timezone.utc)
    med.last_taken = now
    med.next_due = now + timedelta(hours=med.frequency_hours)
    
    db.commit()
    db.refresh(med)
    return med

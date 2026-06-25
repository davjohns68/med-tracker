from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency_hours: float

class MedicationCreate(MedicationBase):
    pass

class Medication(MedicationBase):
    id: int
    owner_id: int
    last_taken: Optional[datetime] = None
    next_due: Optional[datetime] = None

    class Config:
        from_attributes = True
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    medications: List[Medication] = []

    class Config:
        from_attributes = True
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.profile import Profile
from app.core.security import get_current_active_user

router = APIRouter()


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    summary: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    location: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_role: Optional[str] = None
    languages: Optional[str] = None
    available_for_work: Optional[bool] = None


@router.get("/")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile()
        db.add(profile)

    for field, value in data.dict(exclude_none=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

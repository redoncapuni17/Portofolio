from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

from app.db.session import get_db
from app.models.experience import Experience
from app.core.security import get_current_active_user

router = APIRouter()


class ExperienceCreate(BaseModel):
    company_name: str
    position: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    technologies: Optional[str] = None
    company_website: Optional[str] = None
    display_order: int = 0


class ExperienceUpdate(BaseModel):
    company_name: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[str] = None
    company_website: Optional[str] = None
    display_order: Optional[int] = None


@router.get("/")
def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.display_order, Experience.start_date.desc()).all()


@router.post("/")
def create_experience(
    data: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    exp = Experience(**data.dict())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/{exp_id}")
def update_experience(
    exp_id: int,
    data: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for field, value in data.dict(exclude_none=True).items():
        setattr(exp, field, value)
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{exp_id}")
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Deleted"}

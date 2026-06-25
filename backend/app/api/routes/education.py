from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.db.session import get_db
from app.models.education import Education
from app.core.security import get_current_active_user

router = APIRouter()


class EducationCreate(BaseModel):
    institution_name: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    display_order: int = 0


class EducationUpdate(BaseModel):
    institution_name: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    display_order: Optional[int] = None


@router.get("/")
def get_education(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.display_order, Education.start_date.desc()).all()


@router.post("/")
def create_education(
    data: EducationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    edu = Education(**data.dict())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.put("/{edu_id}")
def update_education(
    edu_id: int,
    data: EducationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    for field, value in data.dict(exclude_none=True).items():
        setattr(edu, field, value)
    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/{edu_id}")
def delete_education(
    edu_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(edu)
    db.commit()
    return {"message": "Deleted"}

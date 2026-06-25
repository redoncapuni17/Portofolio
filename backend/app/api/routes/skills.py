from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.skill import Skill
from app.core.security import get_current_active_user

router = APIRouter()


class SkillCreate(BaseModel):
    name: str
    category: str
    proficiency: int = 80
    icon: Optional[str] = None
    display_order: int = 0


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None


@router.get("/")
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).order_by(Skill.category, Skill.display_order).all()
    # Group by category
    grouped = {}
    for skill in skills:
        if skill.category not in grouped:
            grouped[skill.category] = []
        grouped[skill.category].append(skill)
    return {"skills": skills, "grouped": grouped}


@router.get("/list")
def list_skills(db: Session = Depends(get_db)):
    return db.query(Skill).order_by(Skill.category, Skill.display_order).all()


@router.post("/")
def create_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    skill = Skill(**data.dict())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/{skill_id}")
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for field, value in data.dict(exclude_none=True).items():
        setattr(skill, field, value)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"message": "Deleted"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.social_link import SocialLink
from app.core.security import get_current_active_user

router = APIRouter()


class SocialLinkCreate(BaseModel):
    platform: str
    url: str
    is_active: bool = True
    display_order: int = 0


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


@router.get("/")
def get_social_links(db: Session = Depends(get_db)):
    return db.query(SocialLink).filter(SocialLink.is_active == True).order_by(SocialLink.display_order).all()


@router.get("/all")
def get_all_social_links(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return db.query(SocialLink).order_by(SocialLink.display_order).all()


@router.post("/")
def create_social_link(
    data: SocialLinkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    link = SocialLink(**data.dict())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.put("/{link_id}")
def update_social_link(
    link_id: int,
    data: SocialLinkUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in data.dict(exclude_none=True).items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/{link_id}")
def delete_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(link)
    db.commit()
    return {"message": "Deleted"}

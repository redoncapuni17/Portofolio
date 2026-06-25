from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.seo import SEOSetting
from app.core.security import get_current_active_user

router = APIRouter()


class SEOUpdate(BaseModel):
    site_title: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    robots_txt: Optional[str] = None


@router.get("/")
def get_seo(db: Session = Depends(get_db)):
    settings = db.query(SEOSetting).all()
    return {s.page: s for s in settings}


@router.get("/{page}")
def get_page_seo(page: str, db: Session = Depends(get_db)):
    seo = db.query(SEOSetting).filter(SEOSetting.page == page).first()
    if not seo:
        # Return global as fallback
        seo = db.query(SEOSetting).filter(SEOSetting.page == "global").first()
    return seo


@router.put("/{page}")
def update_seo(
    page: str,
    data: SEOUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    seo = db.query(SEOSetting).filter(SEOSetting.page == page).first()
    if not seo:
        seo = SEOSetting(page=page)
        db.add(seo)
    for field, value in data.dict(exclude_none=True).items():
        setattr(seo, field, value)
    db.commit()
    db.refresh(seo)
    return seo

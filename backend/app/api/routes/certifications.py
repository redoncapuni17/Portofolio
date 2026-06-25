from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.db.session import get_db
from app.models.certification import Certification
from app.core.security import get_current_active_user

router = APIRouter()


class CertificationCreate(BaseModel):
    name: str
    issuing_organization: str
    issue_date: date
    expiration_date: Optional[date] = None
    verification_url: Optional[str] = None
    credential_id: Optional[str] = None
    display_order: int = 0


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[date] = None
    expiration_date: Optional[date] = None
    verification_url: Optional[str] = None
    credential_id: Optional[str] = None
    display_order: Optional[int] = None


@router.get("/")
def get_certifications(db: Session = Depends(get_db)):
    return db.query(Certification).order_by(Certification.display_order, Certification.issue_date.desc()).all()


@router.post("/")
def create_certification(
    data: CertificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    cert = Certification(**data.dict())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.put("/{cert_id}")
def update_certification(
    cert_id: int,
    data: CertificationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    for field, value in data.dict(exclude_none=True).items():
        setattr(cert, field, value)
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/{cert_id}")
def delete_certification(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(cert)
    db.commit()
    return {"message": "Deleted"}

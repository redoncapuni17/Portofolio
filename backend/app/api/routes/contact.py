from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.db.session import get_db
from app.models.contact import ContactMessage
from app.core.security import get_current_active_user

router = APIRouter()


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


@router.post("/")
def submit_contact(data: ContactCreate, request: Request, db: Session = Depends(get_db)):
    msg = ContactMessage(
        **data.dict(),
        ip_address=request.client.host if request.client else None
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"message": "Message sent successfully", "id": msg.id}


@router.get("/")
def get_messages(
    is_read: Optional[bool] = None,
    is_archived: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user)
):
    query = db.query(ContactMessage)
    if is_read is not None:
        query = query.filter(ContactMessage.is_read == is_read)
    if is_archived is not None:
        query = query.filter(ContactMessage.is_archived == is_archived)
    else:
        query = query.filter(ContactMessage.is_archived == False)
    total = query.count()
    msgs = query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "messages": msgs}


@router.put("/{msg_id}/read")
def mark_read(msg_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.put("/{msg_id}/archive")
def archive_message(msg_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_archived = True
    db.commit()
    return {"message": "Archived"}


@router.put("/{msg_id}/unarchive")
def unarchive_message(msg_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_archived = False
    db.commit()
    return {"message": "Unarchived"}


@router.delete("/{msg_id}")
def delete_message(msg_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Deleted"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.certification import Certification
from app.models.contact import ContactMessage
from app.models.education import Education
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user=Depends(get_current_active_user)):
    return {
        "projects": db.query(Project).count(),
        "skills": db.query(Skill).count(),
        "experiences": db.query(Experience).count(),
        "certifications": db.query(Certification).count(),
        "education": db.query(Education).count(),
        "messages": db.query(ContactMessage).filter(ContactMessage.is_archived == False).count(),
        "unread_messages": db.query(ContactMessage).filter(
            ContactMessage.is_read == False,
            ContactMessage.is_archived == False
        ).count(),
        "featured_projects": db.query(Project).filter(Project.is_featured == True).count(),
    }

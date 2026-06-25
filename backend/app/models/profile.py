from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    job_title = Column(String)
    bio = Column(Text)
    summary = Column(Text)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    location = Column(String)
    years_of_experience = Column(Integer, default=0)
    current_role = Column(String)
    languages = Column(String)
    profile_photo = Column(String)
    cv_file = Column(String)
    available_for_work = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

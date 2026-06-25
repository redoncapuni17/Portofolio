from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from app.db.base import Base

class Certification(Base):
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    issuing_organization = Column(String, nullable=False)
    issue_date = Column(Date, nullable=False)
    expiration_date = Column(Date)
    verification_url = Column(String)
    image = Column(String)
    credential_id = Column(String)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

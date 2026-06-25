from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.db.base import Base

class SEOSetting(Base):
    __tablename__ = "seo_settings"
    id = Column(Integer, primary_key=True, index=True)
    page = Column(String, unique=True, nullable=False)
    site_title = Column(String)
    meta_title = Column(String)
    meta_description = Column(Text)
    keywords = Column(Text)
    og_image = Column(String)
    favicon = Column(String)
    robots_txt = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

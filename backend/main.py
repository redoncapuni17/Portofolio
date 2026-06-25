from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base  # This import triggers all model registrations
from app.api.routes import (
    auth, profile, experiences, education, skills,
    projects, certifications, contact, social_links, seo, media, dashboard
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    from app.db.migrate import migrate_schema
    migrate_schema()
    from app.db.init_db import init_db
    init_db()
    yield


app = FastAPI(
    title="Portfolio API",
    description="Personal Portfolio Backend API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(experiences.router, prefix="/api/experiences", tags=["Experiences"])
app.include_router(education.router, prefix="/api/education", tags=["Education"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(certifications.router, prefix="/api/certifications", tags=["Certifications"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(social_links.router, prefix="/api/social-links", tags=["Social Links"])
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])
app.include_router(media.router, prefix="/api/media", tags=["Media"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

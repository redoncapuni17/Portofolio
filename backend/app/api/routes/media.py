import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.security import get_current_active_user

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOC_TYPES = {"application/pdf"}


def save_file(file: UploadFile, subfolder: str) -> str:
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    folder = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(folder, exist_ok=True)
    filepath = os.path.join(folder, filename)
    with open(filepath, "wb") as f:
        content = file.file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
        f.write(content)
    return f"/uploads/{subfolder}/{filename}"


@router.post("/profile-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user=Depends(get_current_active_user)
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    url = save_file(file, "profile")
    # Update profile photo
    from app.db.session import SessionLocal
    from app.models.profile import Profile
    db = SessionLocal()
    try:
        profile = db.query(Profile).first()
        if profile:
            profile.profile_photo = url
            db.commit()
    finally:
        db.close()
    return {"url": url}


@router.post("/cv")
async def upload_cv(
    file: UploadFile = File(...),
    current_user=Depends(get_current_active_user)
):
    if file.content_type not in ALLOWED_DOC_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    url = save_file(file, "cv")
    from app.db.session import SessionLocal
    from app.models.profile import Profile
    db = SessionLocal()
    try:
        profile = db.query(Profile).first()
        if profile:
            profile.cv_file = url
            db.commit()
    finally:
        db.close()
    return {"url": url}


@router.post("/project-image/{project_id}")
async def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    current_user=Depends(get_current_active_user)
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    url = save_file(file, "projects")
    from app.db.session import SessionLocal
    from app.models.project import Project
    db = SessionLocal()
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.image = url
            db.commit()
    finally:
        db.close()
    return {"url": url}


@router.post("/certification-image/{cert_id}")
async def upload_certification_image(
    cert_id: int,
    file: UploadFile = File(...),
    current_user=Depends(get_current_active_user)
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")
    url = save_file(file, "certifications")
    from app.db.session import SessionLocal
    from app.models.certification import Certification
    db = SessionLocal()
    try:
        cert = db.query(Certification).filter(Certification.id == cert_id).first()
        if cert:
            cert.image = url
            db.commit()
    finally:
        db.close()
    return {"url": url}

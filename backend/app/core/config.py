from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Portfolio API"
    DEBUG: bool = False
    SECRET_KEY: str = "your-super-secret-key-change-in-production-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite:///./portfolio.db"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:80", "http://localhost"]

    # Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Admin defaults
    ADMIN_EMAIL: str = "admin@portfolio.com"
    ADMIN_PASSWORD: str = "Admin@123456"
    ADMIN_NAME: str = "Admin User"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.profile import Profile
from app.models.seo import SEOSetting
from app.models.social_link import SocialLink
from app.core.security import get_password_hash
from app.core.config import settings


def init_db():
    db = SessionLocal()
    try:
        # Create admin user if not exists
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                is_active=True,
                is_superuser=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Create default profile if not exists
        profile = db.query(Profile).first()
        if not profile:
            profile = Profile(
                full_name="Your Name",
                job_title="Full Stack Developer",
                bio="Welcome to my portfolio. I build modern web applications.",
                summary="Passionate developer with expertise in modern web technologies.",
                email="contact@example.com",
                phone="+1 234 567 8900",
                address="New York, USA",
                years_of_experience=5,
                available_for_work=True,
            )
            db.add(profile)
            db.commit()

        # Create default SEO settings
        seo = db.query(SEOSetting).filter(SEOSetting.page == "global").first()
        if not seo:
            seo = SEOSetting(
                page="global",
                site_title="My Portfolio",
                meta_title="Your Name - Full Stack Developer",
                meta_description="Professional portfolio showcasing my projects, skills, and experience.",
                keywords="developer, portfolio, fullstack, react, python",
            )
            db.add(seo)
            db.commit()

        # Create default social links
        existing_social = db.query(SocialLink).first()
        if not existing_social:
            social_links = [
                SocialLink(platform="github", url="https://github.com/yourusername", display_order=1),
                SocialLink(platform="linkedin", url="https://linkedin.com/in/yourusername", display_order=2),
                SocialLink(platform="twitter", url="https://twitter.com/yourusername", display_order=3),
                SocialLink(platform="email", url="mailto:contact@example.com", display_order=4),
            ]
            for sl in social_links:
                db.add(sl)
            db.commit()

    finally:
        db.close()

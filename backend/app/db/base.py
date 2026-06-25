from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here so Base knows about all tables
from app.models.user import User  # noqa
from app.models.profile import Profile  # noqa
from app.models.experience import Experience  # noqa
from app.models.education import Education  # noqa
from app.models.skill import Skill  # noqa
from app.models.project import Project  # noqa
from app.models.certification import Certification  # noqa
from app.models.contact import ContactMessage  # noqa
from app.models.social_link import SocialLink  # noqa
from app.models.seo import SEOSetting  # noqa

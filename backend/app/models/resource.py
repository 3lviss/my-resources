import uuid
import enum
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.core.timezone import get_timezone


class ResourceType(enum.Enum):
    tool = "tool"
    library = "library"
    tutorial = "tutorial"
    article = "article"
    video = "video"


class Resource(Base):
    __tablename__ = "resources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(Enum(ResourceType), nullable=False)
    url = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    use_case = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_timezone)
    updated_at = Column(DateTime(timezone=True), default=get_timezone, onupdate=get_timezone)

    user = relationship("User", back_populates="resources")

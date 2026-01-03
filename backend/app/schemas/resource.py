from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.resource import ResourceType


class ResourceOut(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    type: ResourceType
    url: Optional[str]
    description: str
    use_case: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

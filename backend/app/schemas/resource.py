import re
import html
from pydantic import BaseModel, field_validator, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.resource import ResourceType


def sanitize_string(value: str) -> str:
    """Sanitize string by escaping HTML, trimming whitespace, and normalizing spaces."""
    if not value:
        return value
    value = html.escape(value.strip())
    value = re.sub(r'\s+', ' ', value)
    return value


class ResourceUpdate(BaseModel):
    title: str
    type: ResourceType
    url: Optional[str] = None
    description: str
    use_case: Optional[str] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = sanitize_string(v)
        if not v:
            raise ValueError('Title is required')
        if len(v) < 2:
            raise ValueError('Title must be at least 2 characters')
        if len(v) > 200:
            raise ValueError('Title must be less than 200 characters')
        return v

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: str) -> str:
        v = sanitize_string(v)
        if not v:
            raise ValueError('Description is required')
        if len(v) < 10:
            raise ValueError('Description must be at least 10 characters')
        if len(v) > 2000:
            raise ValueError('Description must be less than 2000 characters')
        return v

    @field_validator('url')
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if not v or not v.strip():
            return None
        v = v.strip()
        if not re.match(r'^https?://', v):
            raise ValueError('URL must start with http:// or https://')
        if len(v) > 500:
            raise ValueError('URL must be less than 500 characters')
        return v

    @field_validator('use_case')
    @classmethod
    def validate_use_case(cls, v: Optional[str]) -> Optional[str]:
        if not v or not v.strip():
            return None
        v = sanitize_string(v)
        if len(v) > 1000:
            raise ValueError('Use case must be less than 1000 characters')
        return v


class ResourceCreate(ResourceUpdate):
    """Same validation as ResourceUpdate"""
    pass


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

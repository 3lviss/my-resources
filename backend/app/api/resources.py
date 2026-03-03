import os
import requests

from uuid import UUID
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Resource
from app.models.resource import ResourceType
from app.schemas import ApiResponse, ResourceOut, ResourceUpdate, ResourceCreate
from app.services.filter_service import FilterService


def get_user(request: Request, db: Session = Depends(get_db)) -> User:
    return get_current_user(request, db)


router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("")
def get_resources(
    page: int = Query(1, ge=1),
    per_page: int = Query(5, ge=1, le=100),
    type: str = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_user)
):
    filter_service = FilterService(db, Resource).filter(user_id=user.id)

    if type:
        filter_service = filter_service.filter(type=type)

    if search:
        filter_service = filter_service.search("title", search)

    result = filter_service.sort_by("updated_at", descending=True).paginate(page=page, per_page=per_page)

    resources_out = [ResourceOut.model_validate(r).model_dump(mode="json") for r in result.items]

    response = ApiResponse.success(
        data={
            "items": resources_out,
            "page": result.page,
            "per_page": result.per_page,
            "total": result.total,
            "total_pages": result.total_pages
        },
        message="Resources retrieved"
    )
    return JSONResponse(status_code=200, content=response.model_dump())


@router.get("/types")
def get_resource_types():
    types = [t.value for t in ResourceType]
    response = ApiResponse.success(data=types, message="Resource types retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.post("")
def create_resource(
    create_data: ResourceCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_user)
):
    resource = Resource(
        user_id=user.id,
        title=create_data.title,
        type=create_data.type,
        url=create_data.url,
        description=create_data.description,
        use_case=create_data.use_case
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    resource_out = ResourceOut.model_validate(resource).model_dump(mode="json")

    # Trigger N8n workflow to append resource to Google Sheets
    try:
        webhook_url = os.getenv("N8N_RESOURCE_WEBHOOK_URL")
        requests.post(webhook_url, json=resource_out)
    except Exception:
        pass  # Don't fail resource creation if webhook fails

    response = ApiResponse.success(data=resource_out, message="Resource created successfully", status_code=201)
    return JSONResponse(status_code=201, content=response.model_dump())


@router.get("/all")
def get_all_resources(api_key: str = Query(None), db: Session = Depends(get_db)):
    """Get all resources for n8n - requires API key"""

    ALLOWED_API_KEY = os.getenv("N8N_API_KEY")
    if not api_key or api_key != ALLOWED_API_KEY:
        response = ApiResponse.error(message="Invalid API key", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    resources = db.query(Resource).all()
    resources_out = [ResourceOut.model_validate(r).model_dump(mode="json") for r in resources]
    response = ApiResponse.success(data=resources_out, message="All resources retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.get("/{resource_id}")
def get_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_user)
):
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.user_id == user.id
    ).first()

    if not resource:
        response = ApiResponse.error(message="Resource not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

    resource_out = ResourceOut.model_validate(resource).model_dump(mode="json")
    response = ApiResponse.success(data=resource_out, message="Resource retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.put("/{resource_id}")
def update_resource(
    resource_id: UUID,
    update_data: ResourceUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_user)
):
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.user_id == user.id
    ).first()

    if not resource:
        response = ApiResponse.error(message="Resource not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

    # Update resource fields
    resource.title = update_data.title
    resource.type = update_data.type
    resource.url = update_data.url
    resource.description = update_data.description
    resource.use_case = update_data.use_case

    db.commit()
    db.refresh(resource)

    resource_out = ResourceOut.model_validate(resource).model_dump(mode="json")
    response = ApiResponse.success(data=resource_out, message="Resource updated successfully")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_user)
):
    resource = db.query(Resource).filter(
        Resource.id == resource_id,
        Resource.user_id == user.id
    ).first()

    if not resource:
        response = ApiResponse.error(message="Resource not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

    db.delete(resource)
    db.commit()

    response = ApiResponse.success(data=None, message="Resource deleted successfully")
    return JSONResponse(status_code=200, content=response.model_dump())

from uuid import UUID
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_token
from app.models import User, Resource
from app.models.resource import ResourceType
from app.schemas import ApiResponse, ResourceOut, ResourceUpdate

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("")
def get_resources(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        response = ApiResponse.error(message="Not authenticated", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    payload = verify_token(token)
    if not payload:
        response = ApiResponse.error(message="Invalid token", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        response = ApiResponse.error(message="User not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

    query = db.query(Resource).filter(Resource.user_id == user.id)
    total = query.count()
    total_pages = (total + per_page - 1) // per_page

    offset = (page - 1) * per_page
    resources = query.order_by(Resource.created_at.desc()).offset(offset).limit(per_page).all()
    resources_out = [ResourceOut.model_validate(r).model_dump(mode="json") for r in resources]

    response = ApiResponse.success(
        data={
            "items": resources_out,
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages
        },
        message="Resources retrieved"
    )
    return JSONResponse(status_code=200, content=response.model_dump())


@router.get("/types")
def get_resource_types():
    types = [t.value for t in ResourceType]
    response = ApiResponse.success(data=types, message="Resource types retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.get("/{resource_id}")
def get_resource(
    resource_id: UUID,
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        response = ApiResponse.error(message="Not authenticated", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    payload = verify_token(token)
    if not payload:
        response = ApiResponse.error(message="Invalid token", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        response = ApiResponse.error(message="User not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

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
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        response = ApiResponse.error(message="Not authenticated", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    payload = verify_token(token)
    if not payload:
        response = ApiResponse.error(message="Invalid token", status_code=401)
        return JSONResponse(status_code=401, content=response.model_dump())

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        response = ApiResponse.error(message="User not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

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

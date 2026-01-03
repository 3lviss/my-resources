import os
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.user import User
from app.schemas import ApiResponse, UserRegister, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

SECURE_COOKIES = os.getenv("SECURE_COOKIES", "false").lower() == "true"


@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        response = ApiResponse.error(message="Email already registered", status_code=400)
        return JSONResponse(status_code=400, content=response.model_dump())

    new_user = User(email=user_data.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_out = UserOut.model_validate(new_user)
    response = ApiResponse.success(data=user_out.model_dump(mode="json"), message="User registered successfully", status_code=201)
    return JSONResponse(status_code=201, content=response.model_dump())


@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        response = ApiResponse.error(message="User not found", status_code=404)
        return JSONResponse(status_code=404, content=response.model_dump())

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    user_out = UserOut.model_validate(user)
    response = ApiResponse.success(data=user_out.model_dump(mode="json"), message="Login successful")
    json_response = JSONResponse(status_code=200, content=response.model_dump())
    json_response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    return json_response


@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
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

    user_out = UserOut.model_validate(user)
    response = ApiResponse.success(data=user_out.model_dump(mode="json"), message="User retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())


@router.post("/logout")
def logout():
    response = ApiResponse.success(message="Logged out successfully")
    json_response = JSONResponse(status_code=200, content=response.model_dump())
    json_response.delete_cookie(key="access_token")
    return json_response

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas import ApiResponse, UserRegister, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


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

    user_out = UserOut.model_validate(user)
    response = ApiResponse.success(data=user_out.model_dump(mode="json"), message="Login successful")
    return JSONResponse(status_code=200, content=response.model_dump())

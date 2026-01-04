from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.schemas import ApiResponse


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {"msg": "Validation failed"}
    message = first_error.get("msg", "Validation failed")
    if isinstance(message, str) and message.startswith("Value error, "):
        message = message.replace("Value error, ", "")
    response = ApiResponse.error(message=message, status_code=400)
    return JSONResponse(status_code=400, content=response.model_dump())


async def http_exception_handler(request: Request, exc: HTTPException):
    response = ApiResponse.error(message=exc.detail, status_code=exc.status_code)
    return JSONResponse(status_code=exc.status_code, content=response.model_dump())

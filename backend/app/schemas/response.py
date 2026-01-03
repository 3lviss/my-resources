from typing import Any, Optional
from pydantic import BaseModel


class ApiResponse(BaseModel):
    status_code: int
    message: str
    data: Optional[Any] = None

    @classmethod
    def success(cls, data: Any = None, message: str = "Success", status_code: int = 200):
        return cls(status_code=status_code, message=message, data=data)

    @classmethod
    def error(cls, message: str = "Error", status_code: int = 400, data: Any = None):
        return cls(status_code=status_code, message=message, data=data)

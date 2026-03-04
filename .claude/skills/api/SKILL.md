# API Endpoint Generator

Generate FastAPI endpoint files for the resource management backend application.

## Usage

```
/api {name}
```

## Parameters

- **name** (required): Name of the API endpoint (e.g., `products`, `users`, `tokmak`)
  - Will create file: `backend/app/api/{name}.py`
  - Router prefix: `/{name}`
  - Router tag: `{name}`
  - GET method will be named: `get_{name}`

## Generated Structure

The skill creates a new API file with:

```python
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import ApiResponse

router = APIRouter(prefix="{prefix}", tags={tags})

@router.get("")
def get_{name}(db: Session = Depends(get_db)):
    response = ApiResponse.success(data=[], message="{name} retrieved")
    return JSONResponse(status_code=200, content=response.model_dump())
```

## Requirements

- FastAPI router setup with proper prefix and tags
- Basic GET endpoint with ApiResponse format
- Database dependency injection ready
- File created at `backend/app/api/{name}.py`
- Must be registered in `backend/app/main.py` if needed

## Project Context

This skill generates endpoints following these patterns:

- All responses use `ApiResponse.success()` or `ApiResponse.error()`
- All responses return `JSONResponse` with proper status codes
- Database connections use `Depends(get_db)`
- Authentication uses `Depends(get_user)` when needed
- Endpoints support pagination with `page` and `per_page` query params

## Example Invocation

```
/api products
```

This would create:
- File: `backend/app/api/products.py`
- Router prefix: `/products`
- Router tag: `["products"]`
- Method: `get_products()`

# API Reviewer Agent Memory

## Project API Patterns

### ApiResponse Format
All endpoints must return `ApiResponse` with this structure:
```python
from app.schemas import ApiResponse
response = ApiResponse.success(data=[], message="Resources retrieved")
return JSONResponse(status_code=200, content=response.model_dump())
```

### Authentication Pattern
- Use `Depends(get_user)` for protected endpoints
- Use `Depends(get_db)` for database access
- JWT tokens stored in HTTP-only cookies
- Check `app/core/security.py` for patterns

### User-Scoped Resources
All resource queries must filter by authenticated user:
```python
resources = db.query(Resource).filter(Resource.user_id == user.id)
```

### Pagination Pattern
List endpoints should support `page` and `per_page` params:
```python
page = query_params.page or 1
per_page = query_params.per_page or 5
resources = db.query(Resource).offset((page-1)*per_page).limit(per_page)
```

### Error Handling
Use ApiResponse.error() for failures:
```python
return JSONResponse(
    status_code=400,
    content=ApiResponse.error(message="Invalid input").model_dump()
)
```

## Common Issues to Check

1. **Missing user filtering** - Endpoints exposing all users' resources
2. **Unvalidated input** - Missing Pydantic schema validation
3. **Wrong status codes** - 200 instead of 201 for creation
4. **Incomplete error handling** - Missing try/except blocks
5. **No pagination** - List endpoints without page/per_page support

## Security Considerations

- Always validate and sanitize user input
- HTML escape resource fields before storage
- Never expose internal error details in responses
- Check user owns resource before allowing DELETE/PUT
- Rate limiting readiness for endpoints

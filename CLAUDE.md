# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack resource management application with FastAPI backend and React frontend in a monorepo structure.

## Commands

### Backend (run from `backend/` directory)
```bash
uvicorn app.main:app --reload          # Dev server at http://localhost:8000
alembic upgrade head                    # Apply migrations
alembic revision --autogenerate -m ""   # Create migration
python seed.py                          # Seed database with demo data
```

### Frontend (run from `frontend/` directory)
```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint
```

### Database
PostgreSQL required. Configure in `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

## Architecture

### Backend (`backend/`)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Structure**: Layered architecture
  - `app/api/` - Route handlers (auth.py, resources.py)
  - `app/models/` - SQLAlchemy models (User, Resource)
  - `app/schemas/` - Pydantic validation schemas
  - `app/services/` - Business logic
  - `app/core/` - Database config, security (JWT), custom exceptions
- **Auth**: JWT tokens stored in HTTP-only cookies
- **API Response**: All endpoints return standardized `ApiResponse` format

### Frontend (`frontend/`)
- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS
- **Structure**:
  - `src/pages/` - Page components (Dashboard, Login, Register, ResourceEdit)
  - `src/components/` - Reusable UI (Datatable, Pagination, ConfirmModal, Toast)
  - `src/context/AuthContext.tsx` - Authentication state via React Context
  - `src/lib/api.ts` - Centralized API client with fetch wrapper
- **Routing**: React Router with ProtectedRoute/GuestRoute guards

### Key Patterns
- User-scoped resources: All resource queries filter by authenticated user
- Input sanitization: HTML escaping applied to resource fields before storage
- Pagination: Backend supports `page` and `per_page` query params (default: 5 per page)

## API Endpoints

**Auth** (`/auth`): POST `/register`, POST `/login`, GET `/me`, POST `/logout`

**Resources** (`/resources`): GET (paginated list), POST (create), GET `/{id}`, PUT `/{id}`, DELETE `/{id}`, GET `/types`

## Models

**Resource types**: `tool`, `library`, `tutorial`, `article`, `video`

**Validation limits**:
- Title: 2-200 chars
- Description: 10-2000 chars
- URL: Optional, must be http/https
- Use case: Optional, max 1000 chars

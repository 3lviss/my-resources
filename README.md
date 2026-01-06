# Resource Management Application

A full-stack web application for managing and organizing resources. Built with FastAPI backend and React frontend.

## Overview

This is a modern resource management system that allows users to:
- Create, read, update, and delete resources
- Organize resources by type (tool, library, tutorial, article, video)
- Search and filter resources
- Track creation and modification timestamps
- Manage resources across a responsive web interface

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (HTTP-only cookies)
- **Validation**: Pydantic

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context

## Project Structure

```
app/
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic (FilterService)
│   │   ├── core/             # Database, security, exceptions
│   │   └── main.py           # FastAPI app entry point
│   ├── alembic/              # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── seed.py               # Demo data seeding
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth)
│   │   ├── lib/              # API client & utilities
│   │   ├── layouts/          # Layout components
│   │   └── main.tsx          # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml        # Docker composition
└── README.md                 # This file
```

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL 12+
- Git

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables (`.env` file):
```
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
CORS_ORIGINS=http://localhost:5173
SECURE_COOKIES=false
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. (Optional) Seed database with demo data:
```bash
python seed.py
```

7. Start development server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env.local` file):
```
VITE_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Available Commands

### Backend
```bash
# Development server with auto-reload
uvicorn app.main:app --reload

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Migration name"

# Seed database
python seed.py
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Lint code
npm run lint
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### Resources (`/resources`)
- `GET /resources` - List resources (paginated, filterable, searchable)
  - Query params: `page`, `per_page`, `type`, `search`
- `POST /resources` - Create new resource
- `GET /resources/{id}` - Get resource by ID
- `PUT /resources/{id}` - Update resource
- `DELETE /resources/{id}` - Delete resource
- `GET /resources/types` - Get available resource types

## Features

### Resource Management
- Full CRUD operations with user-scoped resources
- Pagination with configurable page size (default: 5, max: 100)
- Real-time search filtering by title
- Filter by resource type
- Timestamps for creation and modification

### UI/UX
- Responsive design (mobile-first)
- Modern dark theme
- Intuitive toolbar with search and filters
- Clickable resource titles for quick edit access
- External link button for resource URLs
- Toast notifications for user feedback
- Confirmation modals for destructive actions

### Security
- JWT authentication with HTTP-only cookies
- User-scoped resource queries
- HTML escaping for resource fields
- CORS protection
- Input validation with Pydantic

## Resource Types

- `tool` - Software tools and utilities
- `library` - Code libraries and frameworks
- `tutorial` - Learning guides and tutorials
- `article` - Blog posts and articles
- `video` - Video content and courses

## Validation Rules

### Resource Fields
- **Title**: 2-200 characters
- **Description**: 10-2000 characters
- **URL**: Optional, must be http/https protocol
- **Use Case**: Optional, max 1000 characters

## Architecture Highlights

### FilterService
A generic, reusable filtering service for database queries:
- Filter by multiple fields
- Flexible LIKE search
- Sorting (ascending/descending)
- Automatic pagination with metadata
- Chainable API for clean query building

### Authentication Flow
1. User registers/logs in with email
2. Backend generates JWT token
3. Token stored in HTTP-only cookie
4. Frontend uses cookie for subsequent requests
5. AuthContext maintains authentication state

### API Response Format
All endpoints return standardized response:
```json
{
  "status_code": 200,
  "message": "Success message",
  "data": { /* response data */ }
}
```

## Environment Variables

### Backend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| CORS_ORIGINS | Allowed frontend origins | `http://localhost:5173` |
| SECURE_COOKIES | Use secure cookies in production | `true` |
| SECRET_KEY | JWT secret key | `your-secret-key` |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | `1440` |

### Frontend (`.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | `http://localhost:8000` |

## Docker

Run the entire stack with Docker Compose:
```bash
docker-compose up
```

This will start:
- PostgreSQL database
- FastAPI backend
- React frontend

## Development Notes

### Adding New Features
1. Backend: Add model, schema, API endpoint
2. Frontend: Add page/component, update API client
3. Test thoroughly on both mobile and desktop

### Code Style
- Backend: Follow PEP 8 conventions
- Frontend: Use TypeScript for type safety
- Always include error handling and user feedback

### Database Migrations
```bash
# After modifying models
alembic revision --autogenerate -m "Add new field"
alembic upgrade head
```

## Testing

Currently manual testing through:
- Swagger UI: `http://localhost:8000/docs`
- Frontend application: `http://localhost:5173`

## Performance Considerations

- Resources are paginated (default 5 per page)
- Search uses case-insensitive LIKE queries
- Filters are applied server-side for efficiency
- User-scoped queries prevent unauthorized access

## Future Enhancements

- Unit and integration tests
- Advanced filtering options
- Resource categories and tags
- User preferences and favorites
- Export functionality (CSV, JSON)
- Dark/light theme toggle
- Advanced search with operators

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Run migrations: `alembic upgrade head`

### Frontend won't connect
- Check backend is running on port 8000
- Verify VITE_API_URL in `.env.local`
- Clear browser cache and reload

### Database errors
- Reset database: Drop all tables and run migrations
- Check user permissions in PostgreSQL
- Verify database exists

## License

This project is open source.

## Support

For issues or questions, please open an issue in the repository.

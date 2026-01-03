from app.core.database import SessionLocal
from app.models import User, Resource, ResourceType

def seed():
    db = SessionLocal()

    try:
        user = db.query(User).first()

        if not user:
            user = User(email="demo@example.com")
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user: {user.email}")
        else:
            print(f"Using existing user: {user.email}")

        existing_resources = db.query(Resource).filter(Resource.user_id == user.id).count()
        if existing_resources > 0:
            print(f"User already has {existing_resources} resources. Skipping seed.")
            return

        resources = [
            {
                "title": "FastAPI",
                "type": ResourceType.library,
                "url": "https://fastapi.tiangolo.com",
                "description": "Modern, fast web framework for building APIs with Python based on standard Python type hints.",
                "use_case": "Building REST APIs with automatic OpenAPI documentation"
            },
            {
                "title": "React Documentation",
                "type": ResourceType.tutorial,
                "url": "https://react.dev",
                "description": "Official React documentation with tutorials and API reference.",
                "use_case": "Learning React fundamentals and advanced patterns"
            },
            {
                "title": "Tailwind CSS",
                "type": ResourceType.library,
                "url": "https://tailwindcss.com",
                "description": "A utility-first CSS framework for rapidly building custom user interfaces.",
                "use_case": "Styling web applications without writing custom CSS"
            },
            {
                "title": "SQLAlchemy ORM Tutorial",
                "type": ResourceType.article,
                "url": "https://docs.sqlalchemy.org/en/20/orm/tutorial.html",
                "description": "Comprehensive guide to using SQLAlchemy ORM for database operations.",
                "use_case": "Database modeling and queries in Python applications"
            },
            {
                "title": "Postman",
                "type": ResourceType.tool,
                "url": "https://www.postman.com",
                "description": "API platform for building and using APIs with features for testing and documentation.",
                "use_case": "Testing and debugging REST APIs during development"
            },
            {
                "title": "Git & GitHub Crash Course",
                "type": ResourceType.video,
                "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
                "description": "Beginner-friendly video tutorial covering Git basics and GitHub workflows.",
                "use_case": "Learning version control for collaborative development"
            },
            {
                "title": "Docker",
                "type": ResourceType.tool,
                "url": "https://www.docker.com",
                "description": "Platform for developing, shipping, and running applications in containers.",
                "use_case": "Containerizing applications for consistent deployment"
            },
            {
                "title": "TypeScript Handbook",
                "type": ResourceType.tutorial,
                "url": "https://www.typescriptlang.org/docs/handbook",
                "description": "Official TypeScript documentation covering types, interfaces, and advanced features.",
                "use_case": "Adding type safety to JavaScript projects"
            },
            {
                "title": "JWT.io",
                "type": ResourceType.tool,
                "url": "https://jwt.io",
                "description": "Tool for decoding, verifying, and generating JSON Web Tokens.",
                "use_case": "Debugging and understanding JWT authentication tokens"
            },
            {
                "title": "Clean Code Summary",
                "type": ResourceType.article,
                "url": None,
                "description": "Key principles from Robert C. Martin's Clean Code book about writing maintainable software.",
                "use_case": "Improving code quality and readability"
            }
        ]

        for resource_data in resources:
            resource = Resource(user_id=user.id, **resource_data)
            db.add(resource)

        db.commit()
        print(f"Created {len(resources)} resources for user {user.email}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()

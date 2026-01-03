from fastapi import FastAPI

from app.api import auth_router, dashboard_router

app = FastAPI(title="API")

app.include_router(auth_router)
app.include_router(dashboard_router)

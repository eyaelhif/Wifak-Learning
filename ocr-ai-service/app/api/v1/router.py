from fastapi import APIRouter

from app.api.v1.routes import courses, health

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])


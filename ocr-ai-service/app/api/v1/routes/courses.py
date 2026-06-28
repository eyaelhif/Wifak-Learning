from functools import lru_cache

from fastapi import APIRouter, File, Form, Query, UploadFile

from app.schemas.course import AskRequest, AskResponse, CourseAnalysisResponse, SearchResponse
from app.services.course_analysis_service import CourseAnalysisService

router = APIRouter()


@lru_cache
def get_course_analysis_service() -> CourseAnalysisService:
    return CourseAnalysisService()


@router.post("/analyze", response_model=CourseAnalysisResponse)
async def analyze_course(
    file: UploadFile = File(...),
    source_course_id: str | None = Form(default=None),
    created_by: str | None = Form(default=None),
) -> CourseAnalysisResponse:
    service = get_course_analysis_service()
    return await service.analyze_upload(file=file, source_course_id=source_course_id, created_by=created_by)


@router.get("/{course_id}/analysis", response_model=CourseAnalysisResponse)
def get_analysis(course_id: str) -> CourseAnalysisResponse:
    return get_course_analysis_service().get_analysis(course_id)


@router.get("/{course_id}/search", response_model=SearchResponse)
def search_course(
    course_id: str,
    query: str = Query(min_length=2, max_length=500),
    top_k: int = Query(default=5, ge=1, le=10),
) -> SearchResponse:
    return get_course_analysis_service().search(course_id, query, top_k)


@router.post("/{course_id}/ask", response_model=AskResponse)
def ask_course(course_id: str, request: AskRequest) -> AskResponse:
    return get_course_analysis_service().ask(course_id, request.question, request.top_k)

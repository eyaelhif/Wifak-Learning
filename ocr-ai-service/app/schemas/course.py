from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class AnalysisStatus(str, Enum):
    completed = "COMPLETED"
    failed = "FAILED"


class TextBlock(BaseModel):
    type: str
    title: str | None = None
    content: str
    page: int | None = None
    confidence: float | None = None


class Chapter(BaseModel):
    title: str
    order: int
    summary: str | None = None
    content: str = ""
    subchapters: list["Chapter"] = Field(default_factory=list)
    important_points: list[str] = Field(default_factory=list)


class Flashcard(BaseModel):
    question: str
    answer: str
    difficulty: str = "medium"
    source: str | None = None


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    explanation: str
    difficulty: str = "medium"


class CourseAnalysisResponse(BaseModel):
    course_id: str
    source_course_id: str | None = None
    status: AnalysisStatus
    title: str
    language: str
    confidence: float
    short_summary: str
    detailed_summary: str
    keywords: list[str]
    chapters: list[Chapter]
    definitions: list[TextBlock]
    lists: list[TextBlock]
    tables: list[TextBlock]
    examples: list[TextBlock]
    important_concepts: list[str]
    flashcards: list[Flashcard]
    quiz: list[QuizQuestion]
    structured_content: list[TextBlock]
    metadata: dict[str, Any]
    created_at: datetime


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=10)


class AskResponse(BaseModel):
    course_id: str
    question: str
    answer: str
    sources: list[TextBlock]


class SearchResponse(BaseModel):
    course_id: str
    query: str
    results: list[TextBlock]


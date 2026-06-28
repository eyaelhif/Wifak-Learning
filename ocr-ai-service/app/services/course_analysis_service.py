from datetime import datetime
from fastapi import UploadFile

from app.core.config import settings
from app.core.logging import logger
from app.core.storage import analysis_path, load_json, save_json
from app.schemas.course import AskResponse, CourseAnalysisResponse, SearchResponse
from app.services.file_service import FileService
from app.services.flashcard_service import FlashcardGenerator
from app.services.keyword_service import KeywordService
from app.services.ocr_service import OCRService
from app.services.quiz_service import QuizGenerator
from app.services.structure_analyzer import CourseStructureAnalyzer
from app.services.summary_service import SummaryGenerator
from app.services.vector_store_service import VectorStoreService


class CourseAnalysisService:
    def __init__(self) -> None:
        self.file_service = FileService()
        self.ocr_service = OCRService()
        self.structure_analyzer = CourseStructureAnalyzer()
        self.keyword_service = KeywordService()
        self.summary_generator = SummaryGenerator()
        self.flashcard_generator = FlashcardGenerator()
        self.quiz_generator = QuizGenerator()
        self.vector_store = VectorStoreService()

    async def analyze_upload(
        self,
        file: UploadFile,
        source_course_id: str | None = None,
        created_by: str | None = None,
    ) -> CourseAnalysisResponse:
        course_id, file_path = await self.file_service.save_upload(file)
        document = self.ocr_service.extract_document(file_path, file.content_type or "")
        structure = self.structure_analyzer.analyze(document.cleaned_text)
        keywords = self.keyword_service.extract(document.cleaned_text)
        short_summary = self.summary_generator.short_summary(document.cleaned_text)
        detailed_summary = self.summary_generator.detailed_summary(document.cleaned_text)
        flashcards = self.flashcard_generator.generate(
            structure["definitions"],
            structure["important_concepts"],
            document.cleaned_text,
        )
        quiz = self.quiz_generator.generate(keywords, structure["important_concepts"], document.cleaned_text)

        confidence = self._average_confidence(document.pages)
        vector_indexed = self._index_course_safely(course_id, document.cleaned_text)
        response = CourseAnalysisResponse(
            course_id=course_id,
            source_course_id=source_course_id,
            status="COMPLETED",
            title=structure["title"],
            language=document.language,
            confidence=confidence,
            short_summary=short_summary,
            detailed_summary=detailed_summary,
            keywords=keywords,
            chapters=structure["chapters"],
            definitions=structure["definitions"],
            lists=structure["lists"],
            tables=structure["tables"],
            examples=structure["examples"],
            important_concepts=structure["important_concepts"],
            flashcards=flashcards,
            quiz=quiz,
            structured_content=structure["structured_content"],
            metadata={
                "filename": file.filename,
                "stored_file": str(file_path),
                "created_by": created_by,
                "pages": len(document.pages),
                "ocr_engine": "tesseract",
                "vector_indexed": vector_indexed,
            },
            created_at=datetime.utcnow(),
        )
        save_json(analysis_path(course_id), response.model_dump(mode="json"))
        return response

    def get_analysis(self, course_id: str) -> CourseAnalysisResponse:
        payload = load_json(analysis_path(course_id))
        return CourseAnalysisResponse(**payload)

    def search(self, course_id: str, query: str, top_k: int = 5) -> SearchResponse:
        return SearchResponse(course_id=course_id, query=query, results=self.vector_store.search(course_id, query, top_k))

    def ask(self, course_id: str, question: str, top_k: int = 5) -> AskResponse:
        answer, sources = self.vector_store.answer_question(course_id, question, top_k)
        return AskResponse(course_id=course_id, question=question, answer=answer, sources=sources)

    def _average_confidence(self, pages: list[object]) -> float:
        values = [getattr(page, "confidence", 0.0) for page in pages]
        return round(sum(values) / len(values), 2) if values else 0.0

    def _index_course_safely(self, course_id: str, text: str) -> bool:
        if not settings.enable_vector_index:
            return False

        try:
            self.vector_store.index_course(course_id, text)
            return True
        except Exception as exc:
            logger.warning("vector_indexing_failed", course_id=course_id, error=str(exc))
            return False

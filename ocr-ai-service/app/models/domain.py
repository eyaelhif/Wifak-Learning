from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class OcrPage:
    page_number: int
    text: str
    confidence: float


@dataclass
class ExtractedDocument:
    filename: str
    mime_type: str
    pages: list[OcrPage]
    raw_text: str
    cleaned_text: str
    language: str
    created_at: datetime = field(default_factory=datetime.utcnow)

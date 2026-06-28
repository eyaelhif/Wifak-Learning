from pathlib import Path

import cv2
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

from app.core.config import settings
from app.core.exceptions import OcrProcessingError
from app.models.domain import ExtractedDocument, OcrPage
from app.services.language_service import LanguageService
from app.services.text_cleaner import TextCleaner


class OCRService:
    def __init__(self) -> None:
        if settings.tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd
        self.cleaner = TextCleaner()
        self.language_service = LanguageService()

    def extract_document(self, file_path: Path, mime_type: str = "") -> ExtractedDocument:
        try:
            images = self._load_images(file_path)
            pages = [self._ocr_image(image, index + 1) for index, image in enumerate(images)]
            raw_text = "\n\n".join(page.text for page in pages)
            cleaned_text = self.cleaner.clean(raw_text)
            language = self.language_service.detect_language(cleaned_text)
            return ExtractedDocument(
                filename=file_path.name,
                mime_type=mime_type,
                pages=pages,
                raw_text=raw_text,
                cleaned_text=cleaned_text,
                language=language,
            )
        except Exception as exc:
            raise OcrProcessingError(str(exc)) from exc

    def _load_images(self, file_path: Path) -> list[Image.Image]:
        if file_path.suffix.lower() == ".pdf":
            return convert_from_path(
                str(file_path),
                dpi=settings.pdf_dpi,
                poppler_path=settings.poppler_path or None,
            )
        return [Image.open(file_path).convert("RGB")]

    def _ocr_image(self, image: Image.Image, page_number: int) -> OcrPage:
        processed = self._preprocess(image)
        text = pytesseract.image_to_string(
            processed,
            lang=settings.tesseract_langs,
            config="--oem 3 --psm 6",
        )
        data = pytesseract.image_to_data(
            processed,
            lang=settings.tesseract_langs,
            output_type=pytesseract.Output.DICT,
            config="--oem 3 --psm 6",
        )

        confidences: list[float] = []
        for token, confidence in zip(data.get("text", []), data.get("conf", [])):
            token = token.strip()
            try:
                conf = float(confidence)
            except ValueError:
                conf = -1.0
            if token and conf >= 0:
                confidences.append(conf)

        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        return OcrPage(page_number=page_number, text=text, confidence=round(avg_confidence, 2))

    def _preprocess(self, image: Image.Image) -> Image.Image:
        array = np.array(image)
        gray = cv2.cvtColor(array, cv2.COLOR_RGB2GRAY)
        gray = cv2.fastNlMeansDenoising(gray, h=30)
        gray = cv2.equalizeHist(gray)
        binary = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            11,
        )
        kernel = np.ones((1, 1), np.uint8)
        opened = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
        return Image.fromarray(opened)

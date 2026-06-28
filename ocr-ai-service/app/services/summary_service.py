from app.services.text_cleaner import TextCleaner
from app.core.config import settings


class SummaryGenerator:
    def __init__(self) -> None:
        self.cleaner = TextCleaner()
        self._pipeline = None

    def short_summary(self, text: str) -> str:
        return self._summarize(text, max_length=120, min_length=35, fallback_sentences=3)

    def detailed_summary(self, text: str) -> str:
        chunks = self._chunks(text, max_chars=3500)[:4]
        summaries = [self._summarize(chunk, max_length=180, min_length=60, fallback_sentences=5) for chunk in chunks]
        return "\n\n".join(summary for summary in summaries if summary).strip()

    def _summarize(self, text: str, max_length: int, min_length: int, fallback_sentences: int) -> str:
        if not settings.enable_transformers:
            return " ".join(self.cleaner.sentences(text)[:fallback_sentences])[: max_length * 8].strip()

        try:
            from transformers import pipeline

            if self._pipeline is None:
                self._pipeline = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
            result = self._pipeline(text[:3500], max_length=max_length, min_length=min_length, do_sample=False)
            return result[0]["summary_text"].strip()
        except Exception:
            return " ".join(self.cleaner.sentences(text)[:fallback_sentences])[: max_length * 8].strip()

    def _chunks(self, text: str, max_chars: int) -> list[str]:
        sentences = self.cleaner.sentences(text)
        chunks: list[str] = []
        current = ""
        for sentence in sentences:
            if len(current) + len(sentence) > max_chars:
                chunks.append(current)
                current = sentence
            else:
                current = f"{current} {sentence}".strip()
        if current:
            chunks.append(current)
        return chunks or [text[:max_chars]]

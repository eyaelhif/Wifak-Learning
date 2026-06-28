from collections import Counter
import re

from app.core.config import settings


class KeywordService:
    def __init__(self) -> None:
        self._model = None

    def extract(self, text: str, top_n: int = 20) -> list[str]:
        if not settings.enable_keybert:
            return self._fallback_keywords(text, top_n)

        try:
            from keybert import KeyBERT

            if self._model is None:
                self._model = KeyBERT("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
            keywords = self._model.extract_keywords(text[:20000], top_n=top_n, stop_words=None)
            return [keyword for keyword, _ in keywords]
        except Exception:
            return self._fallback_keywords(text, top_n)

    def _fallback_keywords(self, text: str, top_n: int) -> list[str]:
        words = re.findall(r"\b[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\-]{4,}\b", text.lower())
        stopwords = {
            "avec", "dans", "pour", "plus", "cette", "cours", "entre", "comme", "ainsi",
            "the", "and", "that", "this", "with", "from", "about", "between", "course",
        }
        counter = Counter(word for word in words if word not in stopwords)
        return [word for word, _ in counter.most_common(top_n)]

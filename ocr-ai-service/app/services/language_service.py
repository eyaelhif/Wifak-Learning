from langdetect import DetectorFactory, detect

DetectorFactory.seed = 42


class LanguageService:
    def detect_language(self, text: str) -> str:
        sample = text[:5000].strip()
        if not sample:
            return "unknown"
        try:
            language = detect(sample)
        except Exception:
            return "unknown"
        if language.startswith("fr"):
            return "fr"
        if language.startswith("en"):
            return "en"
        return language


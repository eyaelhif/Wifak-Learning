import re
import unicodedata


class TextCleaner:
    def clean(self, text: str) -> str:
        text = unicodedata.normalize("NFKC", text)
        text = text.replace("\x0c", "\n")
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"(?<=\w)-\n(?=\w)", "", text)
        text = re.sub(r"(?<![.!?:;])\n(?=[a-zA-ZÀ-ÿ])", " ", text)
        return text.strip()

    def sentences(self, text: str) -> list[str]:
        chunks = re.split(r"(?<=[.!?])\s+", text)
        return [chunk.strip() for chunk in chunks if len(chunk.strip()) > 25]


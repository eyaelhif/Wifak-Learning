import re
from collections import Counter

from app.schemas.course import Chapter, TextBlock
from app.services.text_cleaner import TextCleaner


class CourseStructureAnalyzer:
    HEADING_PATTERNS = [
        re.compile(r"^(chapter|chapitre)\s+\d+[\s:.-]+(.+)$", re.IGNORECASE),
        re.compile(r"^\d+[\).]\s+(.{4,90})$"),
        re.compile(r"^\d+\.\d+[\).]?\s+(.{4,90})$"),
    ]
    DEFINITION_PATTERN = re.compile(
        r"\b(is defined as|refers to|means|est defini comme|designe|signifie|definition)\b",
        re.IGNORECASE,
    )
    EXAMPLE_PATTERN = re.compile(r"\b(example|for example|exemple|par exemple)\b", re.IGNORECASE)
    TABLE_PATTERN = re.compile(r"(\|.+\|)|(\btableau\b|\btable\b)", re.IGNORECASE)
    LIST_PATTERN = re.compile(r"^\s*(-|•|\d+[\).])\s+")

    def __init__(self) -> None:
        self.cleaner = TextCleaner()

    def analyze(self, text: str) -> dict[str, object]:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        title = self._detect_title(lines)
        chapters = self._build_chapters(lines, text)
        blocks = self._extract_blocks(lines)
        important_concepts = self._important_concepts(text)
        return {
            "title": title,
            "chapters": chapters,
            "definitions": blocks["definitions"],
            "lists": blocks["lists"],
            "tables": blocks["tables"],
            "examples": blocks["examples"],
            "structured_content": blocks["structured_content"],
            "important_concepts": important_concepts,
        }

    def _detect_title(self, lines: list[str]) -> str:
        candidates = [line for line in lines[:20] if 8 <= len(line) <= 120]
        if not candidates:
            return "Cours analyse par IA"
        return max(candidates[:8], key=lambda item: (sum(ch.isupper() for ch in item), -len(item)))

    def _is_heading(self, line: str) -> bool:
        if any(pattern.match(line) for pattern in self.HEADING_PATTERNS):
            return True
        words = line.split()
        return 2 <= len(words) <= 10 and len(line) <= 90 and line[:1].isupper() and not line.endswith(".")

    def _build_chapters(self, lines: list[str], full_text: str) -> list[Chapter]:
        chapters: list[Chapter] = []
        current_title: str | None = None
        current_content: list[str] = []

        for line in lines:
            if self._is_heading(line):
                if current_title and current_content:
                    chapters.append(self._chapter(current_title, len(chapters) + 1, current_content))
                current_title = self._normalize_heading(line)
                current_content = []
            elif current_title:
                current_content.append(line)

        if current_title and current_content:
            chapters.append(self._chapter(current_title, len(chapters) + 1, current_content))

        if not chapters:
            chapters = [self._chapter("Contenu principal", 1, self.cleaner.sentences(full_text)[:40])]

        return chapters[:20]

    def _chapter(self, title: str, order: int, content_lines: list[str]) -> Chapter:
        content = " ".join(content_lines).strip()
        important_points = [line for line in content_lines if self.DEFINITION_PATTERN.search(line) or len(line) > 120][:6]
        return Chapter(
            title=title,
            order=order,
            content=content[:6000],
            summary=self._chapter_summary(content),
            important_points=important_points,
            subchapters=[],
        )

    def _chapter_summary(self, content: str) -> str:
        sentences = self.cleaner.sentences(content)
        return " ".join(sentences[:2])[:600]

    def _normalize_heading(self, line: str) -> str:
        for pattern in self.HEADING_PATTERNS:
            match = pattern.match(line)
            if match:
                return match.group(match.lastindex or 1).strip()
        return line.strip(" :-")

    def _extract_blocks(self, lines: list[str]) -> dict[str, list[TextBlock]]:
        definitions: list[TextBlock] = []
        lists: list[TextBlock] = []
        tables: list[TextBlock] = []
        examples: list[TextBlock] = []
        structured_content: list[TextBlock] = []

        for line in lines:
            block = TextBlock(type="paragraph", content=line)
            if self.DEFINITION_PATTERN.search(line):
                block = TextBlock(type="definition", title="Definition", content=line)
                definitions.append(block)
            elif self.LIST_PATTERN.match(line):
                block = TextBlock(type="list", content=line)
                lists.append(block)
            elif self.TABLE_PATTERN.search(line):
                block = TextBlock(type="table", content=line)
                tables.append(block)
            elif self.EXAMPLE_PATTERN.search(line):
                block = TextBlock(type="example", title="Example", content=line)
                examples.append(block)
            structured_content.append(block)

        return {
            "definitions": definitions[:30],
            "lists": lists[:50],
            "tables": tables[:20],
            "examples": examples[:30],
            "structured_content": structured_content[:300],
        }

    def _important_concepts(self, text: str) -> list[str]:
        words = re.findall(r"\b[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\-]{4,}\b", text.lower())
        stopwords = {
            "cours", "avec", "dans", "pour", "plus", "cette", "sont", "that", "this", "with",
            "from", "have", "will", "your", "their", "about", "which", "these", "those",
        }
        counter = Counter(word for word in words if word not in stopwords)
        return [word for word, _ in counter.most_common(25)]


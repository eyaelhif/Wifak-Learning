import re

from app.schemas.course import Flashcard, TextBlock


class FlashcardGenerator:
    def generate(self, definitions: list[TextBlock], important_concepts: list[str], text: str, limit: int = 12) -> list[Flashcard]:
        cards: list[Flashcard] = []

        for definition in definitions[:limit]:
            concept = self._extract_concept(definition.content)
            cards.append(
                Flashcard(
                    question=f"Qu'est-ce que {concept} ?",
                    answer=definition.content,
                    difficulty="medium",
                    source="definition",
                )
            )

        for concept in important_concepts:
            if len(cards) >= limit:
                break
            sentence = self._find_sentence(text, concept)
            if sentence:
                cards.append(
                    Flashcard(
                        question=f"Quel est le role de {concept} dans ce cours ?",
                        answer=sentence,
                        difficulty="medium",
                        source="concept",
                    )
                )

        return cards

    def _extract_concept(self, text: str) -> str:
        before_separator = re.split(r"\b(is|means|refers to|est|signifie|designe)\b", text, flags=re.IGNORECASE)[0]
        return before_separator.strip(" :-")[:80] or "ce concept"

    def _find_sentence(self, text: str, concept: str) -> str | None:
        pattern = re.compile(r"[^.!?]*\b" + re.escape(concept) + r"\b[^.!?]*[.!?]", re.IGNORECASE)
        match = pattern.search(text)
        return match.group(0).strip() if match else None


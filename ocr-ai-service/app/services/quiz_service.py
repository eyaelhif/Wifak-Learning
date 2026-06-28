import random

from app.schemas.course import QuizQuestion


class QuizGenerator:
    def generate(self, keywords: list[str], important_concepts: list[str], text: str, limit: int = 8) -> list[QuizQuestion]:
        concepts = list(dict.fromkeys([*important_concepts, *keywords]))
        questions: list[QuizQuestion] = []

        for concept in concepts[:limit]:
            answer_sentence = self._sentence_for_concept(text, concept)
            if not answer_sentence:
                continue
            distractors = [item for item in concepts if item != concept][:12]
            random.shuffle(distractors)
            options = [concept, *distractors[:3]]
            random.shuffle(options)
            questions.append(
                QuizQuestion(
                    question=f"Quel concept correspond le mieux a cette explication : {answer_sentence[:180]} ?",
                    options=options,
                    correct_answer=concept,
                    explanation=answer_sentence,
                    difficulty="medium",
                )
            )

        return questions

    def _sentence_for_concept(self, text: str, concept: str) -> str | None:
        lower = concept.lower()
        sentences = [sentence.strip() for sentence in text.replace("\n", " ").split(".") if len(sentence.strip()) > 40]
        for sentence in sentences:
            if lower in sentence.lower():
                return f"{sentence}."
        return None


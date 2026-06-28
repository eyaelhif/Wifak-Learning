from typing import Any

from app.core.config import settings
from app.core.storage import save_json, load_json
from app.schemas.course import TextBlock
from app.services.text_cleaner import TextCleaner


class VectorStoreService:
    def __init__(self) -> None:
        self.model: Any = None
        self.qa_pipeline = None
        self.cleaner = TextCleaner()

    def index_course(self, course_id: str, text: str) -> None:
        if not settings.enable_vector_index:
            return

        import faiss
        import numpy as np

        chunks = self._chunk_text(text)
        if not chunks:
            return
        embeddings = self._model().encode(chunks, normalize_embeddings=True)
        matrix = np.asarray(embeddings, dtype="float32")
        index = faiss.IndexFlatIP(matrix.shape[1])
        index.add(matrix)

        base_dir = settings.vector_dir / course_id
        base_dir.mkdir(parents=True, exist_ok=True)
        faiss.write_index(index, str(base_dir / "index.faiss"))
        save_json(base_dir / "chunks.json", [{"content": chunk, "type": "semantic_chunk"} for chunk in chunks])

    def search(self, course_id: str, query: str, top_k: int = 5) -> list[TextBlock]:
        if not settings.enable_vector_index:
            return []

        import faiss
        import numpy as np

        base_dir = settings.vector_dir / course_id
        index_path = base_dir / "index.faiss"
        chunks_path = base_dir / "chunks.json"
        if not index_path.exists() or not chunks_path.exists():
            return []

        index = faiss.read_index(str(index_path))
        chunks = load_json(chunks_path)
        query_embedding = self._model().encode([query], normalize_embeddings=True)
        scores, indices = index.search(np.asarray(query_embedding, dtype="float32"), top_k)
        results: list[TextBlock] = []
        for idx in indices[0]:
            if idx < 0 or idx >= len(chunks):
                continue
            results.append(TextBlock(type="semantic_result", content=chunks[idx]["content"]))
        return results

    def answer_question(self, course_id: str, question: str, top_k: int = 5) -> tuple[str, list[TextBlock]]:
        sources = self.search(course_id, question, top_k)
        context = "\n".join(source.content for source in sources)
        if not context:
            return "Aucun contenu indexe n'a ete trouve pour ce cours.", []
        try:
            from transformers import pipeline

            if self.qa_pipeline is None:
                self.qa_pipeline = pipeline("question-answering", model=settings.qa_model)
            result = self.qa_pipeline(question=question, context=context[:4000])
            return result["answer"], sources
        except Exception:
            return self._fallback_answer(question, sources), sources

    def _chunk_text(self, text: str, max_chars: int = 900, overlap: int = 120) -> list[str]:
        sentences = self.cleaner.sentences(text)
        chunks: list[str] = []
        current = ""
        for sentence in sentences:
            if len(current) + len(sentence) > max_chars:
                chunks.append(current)
                current = current[-overlap:] + " " + sentence
            else:
                current = f"{current} {sentence}".strip()
        if current:
            chunks.append(current)
        return chunks

    def _model(self) -> Any:
        if self.model is None:
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(settings.embedding_model)
        return self.model

    def _fallback_answer(self, question: str, sources: list[TextBlock]) -> str:
        return sources[0].content[:700] if sources else "Je n'ai pas trouve de passage pertinent."

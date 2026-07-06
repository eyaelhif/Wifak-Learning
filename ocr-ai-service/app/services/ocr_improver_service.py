"""
Service d'amélioration du texte OCR via Ollama (LLM local).

Utilise le modèle llama3.1:8b pour corriger les erreurs typiques de l'OCR :
- Caractères confondus (l→1, O→0, rn→m)
- Mots cassés ou collés
- Structure du document perdue
- Passages illisibles remplacés par des marqueurs
"""

import time

import httpx
import structlog

from app.core.config import settings

logger = structlog.get_logger()

# ──────────────────────────────────────────────────────────────────────
# System prompt pour l'amélioration du texte OCR
# ──────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """\
Tu es un système spécialisé dans l'amélioration et la restructuration de textes issus d'OCR de cours académiques et professionnels.

On te fournit un texte extrait d'un document (diapositives, PDF, images).
Ce texte contient des erreurs d'OCR, du bruit d'interface et des répétitions.

Ton rôle :

1. Nettoyer et filtrer le bruit récurrent du document :
   - Supprime systématiquement les en-têtes et pieds de page répétés à chaque page (ex: "© 2024-2025 - Module DevOps", "ESPRIT - UP ASI", "Architecture des Systèmes", "Bureau E204", "HONORIS UNITED UNIVERSITIES", etc.).
   - Supprime les éléments parasites d'interface utilisateur s'ils ont été lus par l'OCR (boutons, menus de navigation, barres de recherche de navigateur comme "Search by repository name", "All Content", "Total Pulls").
2. Corriger uniquement les erreurs évidentes d'OCR (orthographe, mots cassés, caractères confondus comme l->1, O->0, rn->m, etc.).
3. Restaurer la structure logique et propre du cours sous forme de texte clair :
   - Identifie les vrais titres de sections ou chapitres (ex: "La livraison continue - Docker", "1. La virtualisation lourde", etc.) et formate-les clairement avec des balises Markdown (# ou ##).
   - Organise le texte sous forme de paragraphes fluides ou de listes à puces propres.
4. Si une partie du texte provient d'un schéma complexe (comme un diagramme de comparaison VM vs Conteneur) ou est totalement illisible, remplace-la simplement par [CONTENU_NON_TEXTE] ou [INSÉRÉ_IMAGE].
5. Ne jamais inventer de contenu ou d'explications qui ne figurent pas dans le texte d'origine.
6. Ne pas halluciner ni ajouter de commentaires personnels (pas de "Voici le texte corrigé"). Retourne uniquement le cours restructuré.

Retourne uniquement la version corrigée et structurée en Markdown pour un cours propre et directement étudiable.\
"""


class OcrTextImproverService:
    """Service d'amélioration du texte OCR via Ollama (LLM local)."""

    def __init__(self) -> None:
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.model = settings.ollama_model
        self.timeout = settings.ollama_timeout
        self.max_chunk_chars = settings.ocr_improve_max_chunk

    # ── Public API ────────────────────────────────────────────────────

    async def improve(self, ocr_text: str) -> str:
        """
        Améliore le texte OCR via Ollama.

        Découpe le texte en chunks si nécessaire, envoie chaque chunk
        au modèle, puis reassemble le résultat.
        Retourne le texte original en cas d'erreur (fallback gracieux).
        """
        if not ocr_text or not ocr_text.strip():
            return ocr_text

        start = time.time()

        try:
            # Vérifier que Ollama est accessible
            available = await self.is_available()
            if not available:
                logger.warning(
                    "ollama_not_available",
                    base_url=self.base_url,
                    model=self.model,
                )
                return ocr_text

            chunks = self._split_into_chunks(ocr_text)
            improved_chunks: list[str] = []

            for i, chunk in enumerate(chunks):
                logger.info(
                    "ocr_improve_chunk",
                    chunk_index=i + 1,
                    total_chunks=len(chunks),
                    chunk_length=len(chunk),
                )
                improved = await self._improve_chunk(chunk)
                improved_chunks.append(improved)

            result = "\n\n".join(improved_chunks)
            elapsed = round(time.time() - start, 2)
            logger.info(
                "ocr_improvement_done",
                elapsed_seconds=elapsed,
                total_chunks=len(chunks),
                original_length=len(ocr_text),
                improved_length=len(result),
            )
            return result

        except Exception as exc:
            elapsed = round(time.time() - start, 2)
            logger.warning(
                "ocr_improvement_failed",
                error=str(exc),
                elapsed_seconds=elapsed,
            )
            return ocr_text  # Fallback : retourner le texte original

    async def is_available(self) -> bool:
        """Vérifie si Ollama est accessible et si le modèle est disponible."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code != 200:
                    return False
                models = response.json().get("models", [])
                model_base = self.model.split(":")[0]
                return any(
                    m.get("name", "").startswith(model_base)
                    for m in models
                )
        except Exception:
            return False

    # ── Private ───────────────────────────────────────────────────────

    async def _improve_chunk(self, chunk: str) -> str:
        """Envoie un chunk de texte à Ollama pour amélioration."""
        url = f"{self.base_url}/api/generate"

        payload = {
            "model": self.model,
            "system": SYSTEM_PROMPT,
            "prompt": (
                "Voici le texte OCR à corriger :\n"
                '"""\n'
                f"{chunk}\n"
                '"""\n\n'
                "Retourne uniquement la version corrigée."
            ),
            "stream": False,
            "options": {
                "temperature": 0.1,   # Basse température pour des corrections fidèles
                "top_p": 0.9,
                "num_predict": max(len(chunk) * 2, 2048),  # Assez de tokens pour la réponse
            },
        }

        async with httpx.AsyncClient(timeout=float(self.timeout)) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            improved = data.get("response", "").strip()

            # Si la réponse est vide ou beaucoup trop courte, garder l'original
            if not improved or len(improved) < len(chunk) * 0.3:
                logger.warning(
                    "ocr_improve_suspicious_response",
                    original_length=len(chunk),
                    response_length=len(improved),
                )
                return chunk

            return improved

    def _split_into_chunks(self, text: str, max_chars: int | None = None) -> list[str]:
        """
        Découpe le texte en chunks en respectant les limites du modèle.

        Tente de couper sur les doubles sauts de ligne (paragraphes),
        puis sur les phrases si un paragraphe est trop long.
        """
        max_chars = max_chars or self.max_chunk_chars

        if len(text) <= max_chars:
            return [text]

        chunks: list[str] = []
        paragraphs = text.split("\n\n")
        current_chunk = ""

        for paragraph in paragraphs:
            # Est-ce que le paragraphe tient dans le chunk courant ?
            if len(current_chunk) + len(paragraph) + 2 <= max_chars:
                current_chunk = f"{current_chunk}\n\n{paragraph}".strip()
            else:
                # Sauvegarder le chunk courant s'il n'est pas vide
                if current_chunk:
                    chunks.append(current_chunk.strip())

                # Le paragraphe seul est-il trop long ?
                if len(paragraph) > max_chars:
                    sub_chunks = self._split_long_paragraph(paragraph, max_chars)
                    chunks.extend(sub_chunks[:-1])
                    current_chunk = sub_chunks[-1] if sub_chunks else ""
                else:
                    current_chunk = paragraph

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks or [text]

    def _split_long_paragraph(self, paragraph: str, max_chars: int) -> list[str]:
        """Découpe un paragraphe trop long en sous-chunks sur les phrases."""
        # Essayer de couper sur les fins de phrase
        sentences = paragraph.replace(". ", ".\n").split("\n")
        chunks: list[str] = []
        current = ""

        for sentence in sentences:
            if len(current) + len(sentence) + 1 <= max_chars:
                current = f"{current} {sentence}".strip()
            else:
                if current:
                    chunks.append(current.strip())
                # Si la phrase seule est trop longue, la couper brutalement
                if len(sentence) > max_chars:
                    for i in range(0, len(sentence), max_chars):
                        chunks.append(sentence[i:i + max_chars])
                    current = ""
                else:
                    current = sentence

        if current:
            chunks.append(current.strip())

        return chunks or [paragraph]

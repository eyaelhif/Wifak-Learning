# Wifak OCR AI Service

Microservice FastAPI pour analyser automatiquement des cours PDF ou images.

## Fonctionnalites

- Upload PDF, JPG, JPEG, PNG
- OCR Tesseract avec pretraitement OpenCV
- Support francais et anglais
- Detection automatique de langue
- Extraction de structure pedagogique
- Resume court et detaille
- Mots-cles, flashcards, quiz
- Embeddings Sentence Transformers
- Indexation FAISS
- Questions/reponses semantiques sur un cours
- Sauvegarde des uploads, resultats JSON et index vectoriels

## Prerequis systeme

Installer Tesseract OCR et les donnees de langue `fra` et `eng`.

Windows:

```powershell
choco install tesseract
```

Installer Poppler pour `pdf2image`, puis ajouter `bin` au PATH.

## Installation

```powershell
cd C:\Users\Slim\Desktop\eya\stagePFE\site\frontoffice\ocr-ai-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Endpoints principaux

- `POST /api/v1/courses/analyze` : analyser un PDF/image
- `GET /api/v1/courses/{course_id}/analysis` : recuperer une analyse
- `POST /api/v1/courses/{course_id}/ask` : poser une question sur le cours
- `GET /api/v1/courses/{course_id}/search?query=...` : recherche semantique
- `GET /api/v1/health` : sante du service

## Integration Spring Boot

Le backend Spring Boot envoie un `multipart/form-data` vers:

```text
POST http://localhost:8001/api/v1/courses/analyze
```

Champs:

- `file`: fichier PDF/image
- `source_course_id`: identifiant du cours Spring Boot, optionnel
- `created_by`: utilisateur ayant lance l'analyse, optionnel

Le service retourne un JSON structure pret a stocker cote backend.

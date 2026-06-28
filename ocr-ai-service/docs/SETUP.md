# Installation et demarrage

## 1. Installation locale Windows

Installer Tesseract OCR avec les langues francais et anglais.

Installer Poppler puis ajouter le dossier `bin` au `PATH`.

## 2. Environnement Python

```powershell
cd C:\Users\Slim\Desktop\eya\stagePFE\site\frontoffice\ocr-ai-service
py -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Si `python` ou `py` pointe vers une installation Windows Store cassee, installer Python depuis python.org puis rouvrir le terminal.

## 3. Demarrer l'API

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Documentation Swagger:

```text
http://localhost:8001/docs
```

Healthcheck:

```text
http://localhost:8001/api/v1/health
```

## 4. Test rapide avec curl

```powershell
curl.exe -X POST "http://localhost:8001/api/v1/courses/analyze" `
  -F "file=@C:\chemin\cours.pdf" `
  -F "source_course_id=1" `
  -F "created_by=admin"
```

## 5. Demarrage Docker

```powershell
docker compose up --build
```

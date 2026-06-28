# Architecture du microservice Python OCR + IA

## Vue generale

```text
Angular Frontoffice / Backoffice
        |
        v
Spring Boot Backend
        |
        v
FastAPI OCR AI Service
        |
        +-- Upload storage
        +-- Tesseract OCR
        +-- OpenCV preprocessing
        +-- NLP structure analysis
        +-- Transformers summaries and QA
        +-- Sentence Transformers embeddings
        +-- FAISS vector index
        +-- JSON result storage
```

## Arborescence

```text
ocr-ai-service/
  app/
    api/v1/routes/       Endpoints FastAPI
    core/                Configuration, logs, exceptions, stockage
    models/              Modeles domaine internes
    schemas/             Schemas Pydantic retournes par API
    services/            OCR, NLP, generation, embeddings
    main.py              Application FastAPI
  docs/
    ARCHITECTURE.md
  examples/
    analysis-response.example.json
    spring-boot-client.md
  storage/
    uploads/             Fichiers originaux
    results/             Analyses JSON
    vectorstores/        Index FAISS et chunks
  Dockerfile
  docker-compose.yml
  requirements.txt
  run.py
```

## Workflow complet

1. Spring Boot envoie un fichier `multipart/form-data` a `POST /api/v1/courses/analyze`.
2. `FileService` valide le type et sauvegarde le fichier.
3. `OCRService` convertit les PDF en images avec `pdf2image`.
4. `OCRService` ameliore chaque image avec OpenCV.
5. Tesseract extrait le texte en francais et anglais.
6. `TextCleaner` nettoie et normalise le texte.
7. `LanguageService` detecte automatiquement la langue.
8. `CourseStructureAnalyzer` extrait titre, chapitres, definitions, listes, tableaux, exemples et concepts.
9. `SummaryGenerator` produit les resumes.
10. `KeywordService` extrait les mots-cles.
11. `FlashcardGenerator` cree les cartes pedagogiques.
12. `QuizGenerator` cree des questions QCM.
13. `VectorStoreService` cree les embeddings et indexe le contenu dans FAISS.
14. Le resultat JSON est sauvegarde puis retourne au backend Spring Boot.

## Contrat API principal

```http
POST /api/v1/courses/analyze
Content-Type: multipart/form-data
```

Champs:

- `file`: PDF, JPG, JPEG ou PNG
- `source_course_id`: identifiant du cours cote Spring Boot
- `created_by`: administrateur ou formateur

Reponse:

- `title`
- `language`
- `confidence`
- `short_summary`
- `detailed_summary`
- `keywords`
- `chapters`
- `definitions`
- `lists`
- `tables`
- `examples`
- `important_concepts`
- `flashcards`
- `quiz`
- `structured_content`
- `metadata`

## Endpoints semantiques

```http
GET /api/v1/courses/{course_id}/search?query=risque
POST /api/v1/courses/{course_id}/ask
```

Le endpoint `ask` prend:

```json
{
  "question": "Quels sont les principaux risques presentes dans le cours ?",
  "top_k": 5
}
```

## Recommandations production

- Executer le service dans Docker pour controler Tesseract, Poppler et les modeles.
- Ajouter une authentification service-to-service entre Spring Boot et FastAPI.
- Monter `storage/` sur un volume persistant.
- Precharger les modeles Hugging Face en environnement de production.
- Ajouter une file asynchrone si les PDF sont volumineux: RabbitMQ, Redis Queue ou Kafka.
- Stocker les resultats finaux dans MySQL cote Spring Boot et garder FAISS pour la recherche.
- Exposer les metriques via Prometheus si le service passe en production reelle.

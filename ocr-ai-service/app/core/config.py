from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Wifak OCR AI Service"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8001
    log_level: str = "INFO"

    upload_dir: Path = Path("storage/uploads")
    results_dir: Path = Path("storage/results")
    vector_dir: Path = Path("storage/vectorstores")
    max_upload_size_mb: int = 50

    tesseract_cmd: str | None = Field(default=None)
    tesseract_langs: str = "fra+eng"
    pdf_dpi: int = 300
    poppler_path: str | None = Field(default=None)

    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    summary_model: str = "sshleifer/distilbart-cnn-12-6"
    qa_model: str = "deepset/xlm-roberta-base-squad2"
    device: str = "cpu"
    enable_transformers: bool = False
    enable_keybert: bool = False
    enable_vector_index: bool = False

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import UnsupportedFileError


ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}


class FileService:
    async def save_upload(self, file: UploadFile) -> tuple[str, Path]:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            raise UnsupportedFileError("Only PDF, JPG, JPEG and PNG files are accepted")

        if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
            raise UnsupportedFileError(f"Unsupported content type: {file.content_type}")

        course_id = str(uuid4())
        target = settings.upload_dir / course_id / f"original{suffix}"
        target.parent.mkdir(parents=True, exist_ok=True)

        size = 0
        with target.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > settings.max_upload_size_bytes:
                    target.unlink(missing_ok=True)
                    raise UnsupportedFileError("Uploaded file exceeds max allowed size")
                buffer.write(chunk)

        return course_id, target


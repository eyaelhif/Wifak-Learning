from pydantic import BaseModel


class UploadMetadata(BaseModel):
    source_course_id: str | None = None
    created_by: str | None = None

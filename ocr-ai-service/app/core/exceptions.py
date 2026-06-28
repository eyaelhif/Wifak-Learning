from fastapi import HTTPException, status


class AppError(Exception):
    def __init__(self, message: str, code: str = "APP_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class UnsupportedFileError(AppError):
    def __init__(self, message: str = "Unsupported file type") -> None:
        super().__init__(message, "UNSUPPORTED_FILE")


class OcrProcessingError(AppError):
    def __init__(self, message: str = "OCR processing failed") -> None:
        super().__init__(message, "OCR_PROCESSING_FAILED")


def to_http_exception(error: AppError) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"code": error.code, "message": error.message},
    )


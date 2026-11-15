import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = Path(os.getenv("STORAGE_DIR", "/tmp/openpdf_jobs"))
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

JOB_RETENTION_MINUTES = int(os.getenv("JOB_RETENTION_MINUTES", "30"))

ALLOWED_PDF_MIME = ["application/pdf", "application/x-pdf"]
ALLOWED_IMAGE_MIME = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
ALLOWED_OFFICE_MIME = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # docx
    "application/msword", # doc
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", # xlsx
    "application/vnd.ms-excel", # xls
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", # pptx
    "application/vnd.ms-powerpoint", # ppt
]

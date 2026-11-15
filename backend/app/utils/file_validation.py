import re
import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile
import pymupdf

def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', name)
    return cleaned[:100]

def create_job_dir(storage_dir: Path) -> Path:
    job_id = str(uuid.uuid4())
    job_dir = storage_dir / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    return job_dir

async def validate_pdf_upload(file: UploadFile, max_bytes: int) -> bytes:
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413, 
            detail=f"File exceeds maximum allowed size of {max_bytes // (1024 * 1024)}MB."
        )
    if not content.startswith(b"%PDF-"):
        # Some PDFs have comments or whitespace before %PDF-
        header_index = content[:1024].find(b"%PDF-")
        if header_index == -1:
            raise HTTPException(status_code=400, detail="File is not a valid PDF document.")
    
    # Verify PDF structure integrity with pymupdf
    try:
        doc = pymupdf.open(stream=content, filetype="pdf")
        if doc.page_count < 1 and not doc.is_encrypted:
            raise HTTPException(status_code=400, detail="PDF has no pages.")
        doc.close()
    except Exception as e:
        # If encrypted, it might fail to read pages without password, which is expected for unlock tool
        err_msg = str(e).lower()
        if "encrypted" not in err_msg and "password" not in err_msg:
            raise HTTPException(status_code=400, detail=f"PDF file is damaged or unreadable: {str(e)}")
            
    return content

async def validate_image_upload(file: UploadFile, max_bytes: int) -> bytes:
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413, 
            detail=f"Image exceeds maximum allowed size of {max_bytes // (1024 * 1024)}MB."
        )
    return content

async def validate_office_upload(file: UploadFile, max_bytes: int, expected_ext: list[str]) -> bytes:
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded document is empty.")
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413, 
            detail=f"File exceeds maximum allowed size of {max_bytes // (1024 * 1024)}MB."
        )
    filename = file.filename or ""
    ext = Path(filename).suffix.lower()
    if ext not in expected_ext:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file extension. Expected one of: {', '.join(expected_ext)}"
        )
    return content

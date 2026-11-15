from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..config import MAX_UPLOAD_SIZE_BYTES
from ..utils.file_validation import validate_pdf_upload, sanitize_filename
from ..services.pdf_security import protect_pdf, unlock_pdf

router = APIRouter(prefix="/api", tags=["Security"])

@router.post("/protect")
async def api_protect_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    allow_printing: bool = Form(True),
    allow_copying: bool = Form(True),
    allow_modifying: bool = Form(False)
):
    if not password or len(password.strip()) == 0:
        raise HTTPException(status_code=400, detail="Password cannot be empty.")

    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "protected.pdf")

    try:
        protected_bytes = protect_pdf(
            pdf_bytes,
            user_password=password,
            allow_printing=allow_printing,
            allow_copying=allow_copying,
            allow_modifying=allow_modifying
        )
        return Response(
            content=protected_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="protected_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to protect PDF document.")

@router.post("/unlock")
async def api_unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "unlocked.pdf")

    try:
        unlocked_bytes = unlock_pdf(pdf_bytes, password=password)
        return Response(
            content=unlocked_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="unlocked_{orig_name}"'}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to unlock PDF. Please verify the password.")

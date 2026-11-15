from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..config import MAX_UPLOAD_SIZE_BYTES
from ..utils.file_validation import validate_pdf_upload, sanitize_filename
from ..services.pdf_compress import compress_pdf, optimize_pdf, compress_for_email, analyze_pdf_size

router = APIRouter(prefix="/api", tags=["Compress & Optimize"])

@router.post("/compress")
async def api_compress_pdf(
    file: UploadFile = File(...),
    mode: str = Form("recommended") # "low", "recommended", "extreme"
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "compressed.pdf")

    try:
        compressed_bytes, orig_size, final_size, savings_pct = compress_pdf(pdf_bytes, mode=mode)
        headers = {
            "Content-Disposition": f'attachment; filename="compressed_{orig_name}"',
            "X-Original-Size": str(orig_size),
            "X-Final-Size": str(final_size),
            "X-Savings-Percent": str(savings_pct)
        }
        return Response(
            content=compressed_bytes,
            media_type="application/pdf",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to compress PDF: {str(e)}")

@router.post("/optimize")
async def api_optimize_pdf(
    file: UploadFile = File(...),
    remove_metadata: bool = Form(True)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "optimized.pdf")

    try:
        opt_bytes, orig_size, final_size, savings_pct = optimize_pdf(pdf_bytes, remove_metadata=remove_metadata)
        headers = {
            "Content-Disposition": f'attachment; filename="optimized_{orig_name}"',
            "X-Original-Size": str(orig_size),
            "X-Final-Size": str(final_size),
            "X-Savings-Percent": str(savings_pct)
        }
        return Response(
            content=opt_bytes,
            media_type="application/pdf",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to optimize PDF: {str(e)}")

@router.post("/compress-email")
async def api_compress_email(
    file: UploadFile = File(...),
    target_mb: int = Form(2) # 1, 2, 5, 10
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "email_ready.pdf")

    try:
        comp_bytes, orig_size, final_size, savings_pct, target_met = compress_for_email(pdf_bytes, target_mb=target_mb)
        headers = {
            "Content-Disposition": f'attachment; filename="email_{orig_name}"',
            "X-Original-Size": str(orig_size),
            "X-Final-Size": str(final_size),
            "X-Savings-Percent": str(savings_pct),
            "X-Target-Met": str(target_met).lower()
        }
        return Response(
            content=comp_bytes,
            media_type="application/pdf",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to prepare PDF for email: {str(e)}")

@router.post("/analyze-size")
async def api_analyze_size(file: UploadFile = File(...)):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        analysis = analyze_pdf_size(pdf_bytes)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to analyze PDF: {str(e)}")

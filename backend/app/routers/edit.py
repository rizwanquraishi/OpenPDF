import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..config import MAX_UPLOAD_SIZE_BYTES
from ..utils.file_validation import validate_pdf_upload, validate_image_upload, sanitize_filename
from ..services.pdf_edit import (
    add_page_numbers, add_watermark, add_text_to_pdf, add_image_to_pdf, crop_pdf
)

router = APIRouter(prefix="/api", tags=["Edit"])

@router.post("/page-numbers")
async def api_page_numbers(
    file: UploadFile = File(...),
    position: str = Form("bottom-center"),
    start_number: int = Form(1),
    format_str: str = Form("Page {n} of {total}"),
    font_size: int = Form(11),
    color_hex: str = Form("#333333"),
    margin: int = Form(36),
    exclude_cover: bool = Form(False)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "numbered.pdf")

    try:
        numbered_bytes = add_page_numbers(
            pdf_bytes,
            position=position,
            start_number=start_number,
            format_str=format_str,
            font_size=font_size,
            color_hex=color_hex,
            margin=margin,
            exclude_cover=exclude_cover
        )
        return Response(
            content=numbered_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="numbered_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add page numbers: {str(e)}")

@router.post("/watermark")
async def api_watermark(
    file: UploadFile = File(...),
    watermark_text: str = Form(""),
    watermark_image: UploadFile | None = File(None),
    opacity: float = Form(0.3),
    rotation: int = Form(45),
    font_size: int = Form(48),
    color_hex: str = Form("#888888"),
    pages: str = Form("")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "watermarked.pdf")
    
    img_bytes = None
    if watermark_image and watermark_image.filename:
        img_bytes = await validate_image_upload(watermark_image, MAX_UPLOAD_SIZE_BYTES)

    page_numbers = None
    if pages.strip():
        try:
            if pages.startswith("["):
                page_numbers = json.loads(pages)
            else:
                page_numbers = [int(p.strip()) for p in pages.split(",") if p.strip().isdigit()]
        except Exception:
            pass

    try:
        watermarked_bytes = add_watermark(
            pdf_bytes,
            watermark_text=watermark_text,
            watermark_image_bytes=img_bytes,
            opacity=opacity,
            rotation=rotation,
            font_size=font_size,
            color_hex=color_hex,
            pages=page_numbers
        )
        return Response(
            content=watermarked_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="watermarked_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add watermark: {str(e)}")

@router.post("/add-text")
async def api_add_text(
    file: UploadFile = File(...),
    text: str = Form(...),
    page_number: int = Form(1),
    x: float = Form(50.0),
    y: float = Form(50.0),
    font_size: int = Form(14),
    color_hex: str = Form("#000000")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "edited.pdf")

    try:
        edited_bytes = add_text_to_pdf(
            pdf_bytes,
            text=text,
            page_number=page_number,
            x=x,
            y=y,
            font_size=font_size,
            color_hex=color_hex
        )
        return Response(
            content=edited_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="text_added_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add text to PDF: {str(e)}")

@router.post("/add-image")
async def api_add_image(
    file: UploadFile = File(...),
    image: UploadFile = File(...),
    page_number: int = Form(1),
    x: float = Form(50.0),
    y: float = Form(50.0),
    width: float = Form(150.0),
    height: float = Form(150.0)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    img_bytes = await validate_image_upload(image, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "edited.pdf")

    try:
        edited_bytes = add_image_to_pdf(
            pdf_bytes,
            image_bytes=img_bytes,
            page_number=page_number,
            x=x,
            y=y,
            width=width,
            height=height
        )
        return Response(
            content=edited_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="image_added_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to add image to PDF: {str(e)}")

@router.post("/crop")
async def api_crop(
    file: UploadFile = File(...),
    top_margin: float = Form(0),
    bottom_margin: float = Form(0),
    left_margin: float = Form(0),
    right_margin: float = Form(0),
    pages: str = Form("")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "cropped.pdf")

    page_numbers = None
    if pages.strip():
        try:
            if pages.startswith("["):
                page_numbers = json.loads(pages)
            else:
                page_numbers = [int(p.strip()) for p in pages.split(",") if p.strip().isdigit()]
        except Exception:
            pass

    try:
        cropped_bytes = crop_pdf(
            pdf_bytes,
            top_margin=top_margin,
            bottom_margin=bottom_margin,
            left_margin=left_margin,
            right_margin=right_margin,
            pages=page_numbers
        )
        return Response(
            content=cropped_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="cropped_{orig_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to crop PDF: {str(e)}")

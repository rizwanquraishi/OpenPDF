import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..config import MAX_UPLOAD_SIZE_BYTES
from ..utils.file_validation import (
    validate_pdf_upload, validate_image_upload, validate_office_upload, sanitize_filename
)
from ..services.pdf_convert import (
    convert_pdf_to_word, convert_pdf_to_excel, convert_pdf_to_powerpoint,
    convert_pdf_to_images, convert_pdf_to_txt, convert_images_to_pdf, convert_office_to_pdf
)
from ..services.pdf_organize import package_as_zip

router = APIRouter(prefix="/api", tags=["Convert"])

@router.post("/pdf-to-word")
async def api_pdf_to_word(file: UploadFile = File(...)):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")
    
    try:
        docx_bytes = convert_pdf_to_word(pdf_bytes)
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.docx"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert PDF to Word: {str(e)}")

@router.post("/pdf-to-excel")
async def api_pdf_to_excel(
    file: UploadFile = File(...),
    export_format: str = Form("xlsx") # "xlsx" or "csv"
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")

    try:
        xlsx_bytes, csv_str = convert_pdf_to_excel(pdf_bytes)
        if export_format.lower() == "csv":
            return Response(
                content=csv_str.encode("utf-8"),
                media_type="text/csv",
                headers={"Content-Disposition": f'attachment; filename="{base_name}.csv"'}
            )
        else:
            return Response(
                content=xlsx_bytes,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f'attachment; filename="{base_name}.xlsx"'}
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert PDF to Excel: {str(e)}")

@router.post("/pdf-to-powerpoint")
async def api_pdf_to_powerpoint(file: UploadFile = File(...)):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "presentation.pdf").replace(".pdf", "")

    try:
        pptx_bytes = convert_pdf_to_powerpoint(pdf_bytes)
        return Response(
            content=pptx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pptx"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert PDF to PowerPoint: {str(e)}")

@router.post("/pdf-to-jpg")
async def api_pdf_to_jpg(
    file: UploadFile = File(...),
    dpi: int = Form(150),
    pages: str = Form("")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")
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
        images = convert_pdf_to_images(pdf_bytes, img_format="jpg", dpi=dpi, pages=page_numbers)
        if not images:
            raise HTTPException(status_code=400, detail="No images generated from PDF.")
        if len(images) == 1:
            fname, data = images[0]
            return Response(
                content=data,
                media_type="image/jpeg",
                headers={"Content-Disposition": f'attachment; filename="{fname}"'}
            )
        else:
            zip_bytes = package_as_zip(images)
            return Response(
                content=zip_bytes,
                media_type="application/zip",
                headers={"Content-Disposition": f'attachment; filename="{base_name}_images.zip"'}
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert PDF to JPG: {str(e)}")

@router.post("/pdf-to-png")
async def api_pdf_to_png(
    file: UploadFile = File(...),
    dpi: int = Form(150),
    pages: str = Form("")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")
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
        images = convert_pdf_to_images(pdf_bytes, img_format="png", dpi=dpi, pages=page_numbers)
        if not images:
            raise HTTPException(status_code=400, detail="No images generated from PDF.")
        if len(images) == 1:
            fname, data = images[0]
            return Response(
                content=data,
                media_type="image/png",
                headers={"Content-Disposition": f'attachment; filename="{fname}"'}
            )
        else:
            zip_bytes = package_as_zip(images)
            return Response(
                content=zip_bytes,
                media_type="application/zip",
                headers={"Content-Disposition": f'attachment; filename="{base_name}_png.zip"'}
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert PDF to PNG: {str(e)}")

@router.post("/pdf-to-txt")
async def api_pdf_to_txt(
    file: UploadFile = File(...),
    pages: str = Form("")
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    base_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")
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
        txt_content = convert_pdf_to_txt(pdf_bytes, pages=page_numbers)
        return Response(
            content=txt_content.encode("utf-8"),
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.txt"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

@router.post("/jpg-to-pdf")
@router.post("/png-to-pdf")
async def api_images_to_pdf(
    files: list[UploadFile] = File(...),
    orientation: str = Form("auto"), # "auto", "portrait", "landscape"
    margin: int = Form(0)
):
    if not files:
        raise HTTPException(status_code=400, detail="Please upload at least one image.")
        
    img_list = []
    for f in files:
        b = await validate_image_upload(f, MAX_UPLOAD_SIZE_BYTES)
        img_list.append((f.filename or "image", b))

    try:
        pdf_bytes = convert_images_to_pdf(img_list, orientation=orientation, margin=margin)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="images_combined.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to convert images to PDF: {str(e)}")

@router.post("/word-to-pdf")
async def api_word_to_pdf(file: UploadFile = File(...)):
    raw = await validate_office_upload(file, MAX_UPLOAD_SIZE_BYTES, [".docx", ".doc"])
    base_name = sanitize_filename(file.filename or "document.docx").rsplit(".", 1)[0]
    
    try:
        pdf_bytes = convert_office_to_pdf(raw, file.filename or "document.docx")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/excel-to-pdf")
async def api_excel_to_pdf(file: UploadFile = File(...)):
    raw = await validate_office_upload(file, MAX_UPLOAD_SIZE_BYTES, [".xlsx", ".xls"])
    base_name = sanitize_filename(file.filename or "spreadsheet.xlsx").rsplit(".", 1)[0]
    
    try:
        pdf_bytes = convert_office_to_pdf(raw, file.filename or "spreadsheet.xlsx")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/powerpoint-to-pdf")
async def api_powerpoint_to_pdf(file: UploadFile = File(...)):
    raw = await validate_office_upload(file, MAX_UPLOAD_SIZE_BYTES, [".pptx", ".ppt"])
    base_name = sanitize_filename(file.filename or "presentation.pptx").rsplit(".", 1)[0]
    
    try:
        pdf_bytes = convert_office_to_pdf(raw, file.filename or "presentation.pptx")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

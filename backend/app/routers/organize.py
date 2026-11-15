import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from ..config import MAX_UPLOAD_SIZE_BYTES
from ..utils.file_validation import validate_pdf_upload, sanitize_filename
from ..services.pdf_organize import (
    merge_pdfs, split_pdf, extract_pages, delete_pages,
    rotate_pdf, reorder_pages, detect_blank_pages, package_as_zip
)

router = APIRouter(prefix="/api", tags=["Organize"])

@router.post("/merge")
async def api_merge_pdfs(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge.")
    
    pdf_bytes_list = []
    for f in files:
        b = await validate_pdf_upload(f, MAX_UPLOAD_SIZE_BYTES)
        pdf_bytes_list.append(b)
        
    try:
        merged_bytes = merge_pdfs(pdf_bytes_list)
        return Response(
            content=merged_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="merged_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to merge PDFs: {str(e)}")

@router.post("/split")
async def api_split_pdf(
    file: UploadFile = File(...),
    mode: str = Form("all"), # "all", "ranges", "every_n"
    ranges: str = Form(""),
    every_n: int = Form(1)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    orig_name = sanitize_filename(file.filename or "document.pdf").replace(".pdf", "")

    try:
        results = split_pdf(pdf_bytes, mode=mode, ranges=ranges, every_n=every_n)
        if not results:
            raise HTTPException(status_code=400, detail="No output documents generated.")

        if len(results) == 1:
            fname, data = results[0]
            return Response(
                content=data,
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{fname}"'}
            )
        else:
            zip_bytes = package_as_zip(results)
            return Response(
                content=zip_bytes,
                media_type="application/zip",
                headers={"Content-Disposition": f'attachment; filename="{orig_name}_split.zip"'}
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to split PDF: {str(e)}")

@router.post("/extract-pages")
async def api_extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...) # comma-separated e.g. "1,2,5" or json list
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        if pages.startswith("["):
            page_numbers = json.loads(pages)
        else:
            page_numbers = [int(p.strip()) for p in pages.split(",") if p.strip().isdigit()]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid page numbers format. Please provide comma-separated numbers.")

    try:
        extracted = extract_pages(pdf_bytes, page_numbers)
        return Response(
            content=extracted,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="extracted_pages.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/delete-pages")
async def api_delete_pages(
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        if pages.startswith("["):
            page_numbers = json.loads(pages)
        else:
            page_numbers = [int(p.strip()) for p in pages.split(",") if p.strip().isdigit()]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid page numbers format.")

    try:
        result = delete_pages(pdf_bytes, page_numbers)
        return Response(
            content=result,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="pages_removed.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/rotate")
async def api_rotate_pdf(
    file: UploadFile = File(...),
    angle: int = Form(90),
    pages: str = Form("") # empty means all pages
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
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
        rotated = rotate_pdf(pdf_bytes, angle, page_numbers)
        return Response(
            content=rotated,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="rotated_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reorder")
@router.post("/organize")
async def api_reorder_pdf(
    file: UploadFile = File(...),
    order: str = Form(...) # e.g. "3,1,2" or "[3,1,2]"
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        if order.startswith("["):
            new_order = json.loads(order)
        else:
            new_order = [int(p.strip()) for p in order.split(",") if p.strip().isdigit()]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid page order format.")

    try:
        reordered = reorder_pages(pdf_bytes, new_order)
        return Response(
            content=reordered,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="organized_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/detect-blank-pages")
async def api_detect_blank_pages(file: UploadFile = File(...)):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        blank_pages = detect_blank_pages(pdf_bytes)
        return {"blank_pages": blank_pages}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/remove-blank-pages")
async def api_remove_blank_pages(
    file: UploadFile = File(...),
    pages: str = Form("") # if empty, auto-detect
):
    pdf_bytes = await validate_pdf_upload(file, MAX_UPLOAD_SIZE_BYTES)
    try:
        if pages.strip():
            if pages.startswith("["):
                to_delete = json.loads(pages)
            else:
                to_delete = [int(p.strip()) for p in pages.split(",") if p.strip().isdigit()]
        else:
            to_delete = detect_blank_pages(pdf_bytes)

        if not to_delete:
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": 'attachment; filename="no_blank_pages.pdf"'}
            )

        cleaned = delete_pages(pdf_bytes, to_delete)
        return Response(
            content=cleaned,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="blank_pages_removed.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

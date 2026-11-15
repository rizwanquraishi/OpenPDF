import io
import os
import subprocess
import tempfile
import pymupdf
from PIL import Image
import docx
from pdf2docx import Converter
import openpyxl
from pptx import Presentation
from pptx.util import Inches, Pt

def convert_pdf_to_word(pdf_bytes: bytes) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as in_f:
        in_f.write(pdf_bytes)
        in_path = in_f.name
    out_path = in_path + ".docx"

    try:
        cv = Converter(in_path)
        cv.convert(out_path, start=0, end=None)
        cv.close()
        
        if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            with open(out_path, "rb") as out_f:
                return out_f.read()
    except Exception as e:
        # Fallback to python-docx text extraction if pdf2docx encountered formatting error
        pass
    finally:
        for p in [in_path, out_path]:
            if os.path.exists(p):
                os.remove(p)

    # Fallback: create docx from text
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    word_doc = docx.Document()
    for i, page in enumerate(doc):
        text = page.get_text()
        if text.strip():
            word_doc.add_paragraph(text)
        if i < doc.page_count - 1:
            word_doc.add_page_break()
    doc.close()
    
    bio = io.BytesIO()
    word_doc.save(bio)
    return bio.getvalue()

def convert_pdf_to_excel(pdf_bytes: bytes) -> tuple[bytes, str]:
    # Returns (xlsx_bytes, csv_string)
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    wb = openpyxl.Workbook()
    # Remove default sheet if we add custom sheets
    default_sheet = wb.active
    wb.remove(default_sheet)

    csv_lines = []
    tables_found = 0

    for page_idx, page in enumerate(doc, 1):
        tabs = page.find_tables()
        if tabs.tables:
            for t_idx, tab in enumerate(tabs.tables, 1):
                tables_found += 1
                sheet_name = f"P{page_idx}_Table{t_idx}"[:31]
                ws = wb.create_sheet(title=sheet_name)
                extracted_data = tab.extract()
                for row in extracted_data:
                    clean_row = [str(c or "").strip() for c in row]
                    ws.append(clean_row)
                    csv_lines.append(",".join(f'"{c}"' for c in clean_row))
                csv_lines.append("") # blank line between tables

    # If no structured tables found with find_tables, extract tab/space delimited text
    if tables_found == 0:
        ws = wb.create_sheet(title="Extracted Data")
        for page_idx, page in enumerate(doc, 1):
            text = page.get_text("text")
            for line in text.splitlines():
                if not line.strip():
                    continue
                # Split line by multiple spaces or tabs
                parts = [p.strip() for p in line.split("   ") if p.strip()]
                if not parts:
                    parts = [line.strip()]
                ws.append(parts)
                csv_lines.append(",".join(f'"{p}"' for p in parts))

    doc.close()
    bio = io.BytesIO()
    wb.save(bio)
    return bio.getvalue(), "\n".join(csv_lines)

def convert_pdf_to_powerpoint(pdf_bytes: bytes) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    prs = Presentation()
    # Set blank slide layout
    blank_slide_layout = prs.slide_layouts[6]

    for page in doc:
        rect = page.rect
        width_in = rect.width / 72.0
        height_in = rect.height / 72.0
        prs.slide_width = Inches(width_in)
        prs.slide_height = Inches(height_in)

        slide = prs.slides.add_slide(blank_slide_layout)
        
        # Render high-res page image to embed on slide
        pix = page.get_pixmap(dpi=150)
        img_bytes = pix.tobytes("png")
        img_stream = io.BytesIO(img_bytes)

        slide.shapes.add_picture(img_stream, Inches(0), Inches(0), Inches(width_in), Inches(height_in))

    doc.close()
    bio = io.BytesIO()
    prs.save(bio)
    return bio.getvalue()

def convert_pdf_to_images(pdf_bytes: bytes, img_format: str = "jpg", dpi: int = 150, pages: list[int] | None = None) -> list[tuple[str, bytes]]:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    results = []
    ext = img_format.lower()
    if ext == "jpeg":
        ext = "jpg"
        
    target_pages = set(pages) if pages else set(range(1, doc.page_count + 1))

    for p in range(1, doc.page_count + 1):
        if p in target_pages:
            page = doc[p - 1]
            pix = page.get_pixmap(dpi=dpi)
            if ext == "jpg":
                # Convert to RGB (no alpha)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                bio = io.BytesIO()
                img.save(bio, format="JPEG", quality=90)
                results.append((f"page_{p}.jpg", bio.getvalue()))
            else:
                bio = io.BytesIO(pix.tobytes("png"))
                results.append((f"page_{p}.png", bio.getvalue()))

    doc.close()
    return results

def convert_pdf_to_txt(pdf_bytes: bytes, pages: list[int] | None = None) -> str:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    target_pages = set(pages) if pages else set(range(1, doc.page_count + 1))
    text_parts = []

    for p in range(1, doc.page_count + 1):
        if p in target_pages:
            page = doc[p - 1]
            t = page.get_text()
            header = f"--- Page {p} ---"
            text_parts.append(f"{header}\n\n{t.strip()}\n")

    doc.close()
    return "\n".join(text_parts)

def convert_images_to_pdf(image_files: list[tuple[str, bytes]], orientation: str = "auto", margin: int = 0) -> bytes:
    out_doc = pymupdf.open()
    
    for filename, raw in image_files:
        with Image.open(io.BytesIO(raw)) as img:
            w, h = img.size
            img_format = img.format or "PNG"
            
            # Determine page orientation
            if orientation == "portrait":
                page_w, page_h = 595.0, 842.0 # A4
            elif orientation == "landscape":
                page_w, page_h = 842.0, 595.0 # A4
            else: # auto
                if w > h:
                    page_w, page_h = 842.0, 595.0
                else:
                    page_w, page_h = 595.0, 842.0

            page = out_doc.new_page(width=page_w, height=page_h)
            
            avail_w = page_w - (2 * margin)
            avail_h = page_h - (2 * margin)
            
            scale = min(avail_w / w, avail_h / h)
            scaled_w = w * scale
            scaled_h = h * scale
            
            # Center on page
            x = margin + (avail_w - scaled_w) / 2
            y = margin + (avail_h - scaled_h) / 2
            rect = pymupdf.Rect(x, y, x + scaled_w, y + scaled_h)
            
            page.insert_image(rect, stream=raw)

    out_bytes = out_doc.tobytes(deflate=True)
    out_doc.close()
    return out_bytes

def convert_office_to_pdf(doc_bytes: bytes, filename: str) -> bytes:
    ext = os.path.splitext(filename)[1].lower()
    with tempfile.TemporaryDirectory() as tmp_dir:
        in_path = os.path.join(tmp_dir, f"input{ext}")
        with open(in_path, "wb") as f:
            f.write(doc_bytes)

        lo_profile = os.path.join(tmp_dir, "profile")
        cmd = [
            "libreoffice",
            f"-env:UserInstallation=file://{lo_profile}",
            "--headless",
            "--convert-to", "pdf",
            in_path,
            "--outdir", tmp_dir
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=60)
        out_pdf_path = os.path.join(tmp_dir, "input.pdf")
        
        if res.returncode != 0 or not os.path.exists(out_pdf_path):
            err_msg = res.stderr.decode("utf-8", errors="ignore")
            raise RuntimeError(f"Office conversion failed: {err_msg}")
            
        with open(out_pdf_path, "rb") as out_f:
            return out_f.read()

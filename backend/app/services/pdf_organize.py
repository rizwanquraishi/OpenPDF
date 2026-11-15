import io
import zipfile
import pymupdf
from PIL import Image

def merge_pdfs(pdf_bytes_list: list[bytes]) -> bytes:
    if len(pdf_bytes_list) < 2:
        raise ValueError("At least two PDF files are required for merging.")
    
    out_doc = pymupdf.open()
    for b in pdf_bytes_list:
        doc = pymupdf.open(stream=b, filetype="pdf")
        out_doc.insert_pdf(doc)
        doc.close()
    
    out_bytes = out_doc.tobytes(deflate=True)
    out_doc.close()
    return out_bytes

def parse_page_ranges(range_str: str, max_pages: int) -> list[list[int]]:
    groups = []
    for part in range_str.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            start_str, end_str = part.split('-', 1)
            start = max(1, min(max_pages, int(start_str.strip())))
            end = max(1, min(max_pages, int(end_str.strip())))
            if start <= end:
                groups.append(list(range(start, end + 1)))
            else:
                groups.append(list(range(start, end - 1, -1)))
        else:
            p = max(1, min(max_pages, int(part)))
            groups.append([p])
    return groups

def split_pdf(pdf_bytes: bytes, mode: str = "all", ranges: str = "", every_n: int = 1) -> list[tuple[str, bytes]]:
    src_doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total_pages = src_doc.page_count
    results: list[tuple[str, bytes]] = []

    if mode == "all":
        for i in range(total_pages):
            out_doc = pymupdf.open()
            out_doc.insert_pdf(src_doc, from_page=i, to_page=i)
            results.append((f"page_{i + 1}.pdf", out_doc.tobytes(deflate=True)))
            out_doc.close()

    elif mode == "ranges" and ranges:
        page_groups = parse_page_ranges(ranges, total_pages)
        for idx, grp in enumerate(page_groups, 1):
            out_doc = pymupdf.open()
            for p in grp:
                out_doc.insert_pdf(src_doc, from_page=p - 1, to_page=p - 1)
            results.append((f"split_part_{idx}.pdf", out_doc.tobytes(deflate=True)))
            out_doc.close()

    elif mode == "every_n":
        step = max(1, every_n)
        part = 1
        for i in range(0, total_pages, step):
            end_page = min(i + step - 1, total_pages - 1)
            out_doc = pymupdf.open()
            out_doc.insert_pdf(src_doc, from_page=i, to_page=end_page)
            results.append((f"part_{part}_pages_{i + 1}-{end_page + 1}.pdf", out_doc.tobytes(deflate=True)))
            out_doc.close()
            part += 1
    else:
        # Default fallback: split each page
        for i in range(total_pages):
            out_doc = pymupdf.open()
            out_doc.insert_pdf(src_doc, from_page=i, to_page=i)
            results.append((f"page_{i + 1}.pdf", out_doc.tobytes(deflate=True)))
            out_doc.close()

    src_doc.close()
    return results

def extract_pages(pdf_bytes: bytes, page_numbers: list[int]) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    out_doc = pymupdf.open()
    total = doc.page_count
    
    for p in page_numbers:
        if 1 <= p <= total:
            out_doc.insert_pdf(doc, from_page=p - 1, to_page=p - 1)
            
    if out_doc.page_count == 0:
        out_doc.close()
        doc.close()
        raise ValueError("No valid pages selected for extraction.")
        
    out_bytes = out_doc.tobytes(deflate=True)
    out_doc.close()
    doc.close()
    return out_bytes

def delete_pages(pdf_bytes: bytes, page_numbers: list[int]) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total = doc.page_count
    to_delete = {p - 1 for p in page_numbers if 1 <= p <= total}
    
    if len(to_delete) >= total:
        doc.close()
        raise ValueError("Cannot delete all pages from the PDF document.")
        
    out_doc = pymupdf.open()
    for i in range(total):
        if i not in to_delete:
            out_doc.insert_pdf(doc, from_page=i, to_page=i)
            
    out_bytes = out_doc.tobytes(deflate=True)
    out_doc.close()
    doc.close()
    return out_bytes

def rotate_pdf(pdf_bytes: bytes, angle: int, page_numbers: list[int] | None = None) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total = doc.page_count
    target_pages = set(page_numbers) if page_numbers else set(range(1, total + 1))
    
    for p in range(1, total + 1):
        if p in target_pages:
            page = doc[p - 1]
            page.set_rotation((page.rotation + angle) % 360)
            
    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

def reorder_pages(pdf_bytes: bytes, new_order: list[int]) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total = doc.page_count
    
    out_doc = pymupdf.open()
    for p in new_order:
        if 1 <= p <= total:
            out_doc.insert_pdf(doc, from_page=p - 1, to_page=p - 1)
            
    if out_doc.page_count == 0:
        out_doc.close()
        doc.close()
        raise ValueError("Reorder resulted in an empty document.")
        
    out_bytes = out_doc.tobytes(deflate=True)
    out_doc.close()
    doc.close()
    return out_bytes

def detect_blank_pages(pdf_bytes: bytes) -> list[int]:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    blank_pages = []
    
    for i, page in enumerate(doc):
        text = page.get_text().strip()
        # If there is noticeable text, it's not blank
        if len(text) > 5:
            continue
            
        # If page has drawings/rectangles/images
        images = page.get_images()
        drawings = page.get_drawings()
        if len(images) > 0 or len(drawings) > 2:
            continue
            
        # Check rendered pixmap pixels
        pix = page.get_pixmap(dpi=72)
        # Check if nearly all pixels are white
        samples = pix.samples
        # Simple sample check: count non-255 bytes
        total_samples = len(samples)
        non_white = sum(1 for b in samples if b < 240)
        ratio = non_white / total_samples if total_samples > 0 else 0
        
        if ratio < 0.005: # Less than 0.5% non-white
            blank_pages.append(i + 1)
            
    doc.close()
    return blank_pages

def package_as_zip(files: list[tuple[str, bytes]]) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for fname, data in files:
            zf.writestr(fname, data)
    return buf.getvalue()

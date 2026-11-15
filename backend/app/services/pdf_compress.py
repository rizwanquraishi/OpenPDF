import io
import os
import subprocess
import tempfile
import pymupdf
from PIL import Image

def run_ghostscript_compress(input_path: str, output_path: str, quality_preset: str = "/ebook") -> bool:
    # presets: /screen (extreme, ~72dpi), /ebook (recommended, ~150dpi), /printer (low, ~300dpi)
    cmd = [
        "gs",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={quality_preset}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_path}",
        input_path
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=45)
        return res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 0
    except Exception:
        return False

def compress_pdf_pymupdf(pdf_bytes: bytes, mode: str = "recommended") -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    
    # Mode mapping
    # "low": keep images mostly intact, clean garbage
    # "recommended": resize large images, compress
    # "extreme": aggressive downscale
    quality = 70
    max_dimension = 1500
    if mode == "extreme":
        quality = 40
        max_dimension = 1000
    elif mode == "low":
        quality = 85
        max_dimension = 2000

    # Image recompression
    for page in doc:
        img_list = page.get_images(full=True)
        for img in img_list:
            xref = img[0]
            try:
                base_img = doc.extract_image(xref)
                if not base_img:
                    continue
                img_bytes = base_img["image"]
                img_ext = base_img["ext"]
                
                # Recompress with PIL
                with Image.open(io.BytesIO(img_bytes)) as pil_img:
                    # Convert RGBA to RGB for JPEG
                    if pil_img.mode in ("RGBA", "P"):
                        pil_img = pil_img.convert("RGB")
                    
                    # Resize if too large
                    w, h = pil_img.size
                    if max(w, h) > max_dimension:
                        pil_img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                        
                    out_io = io.BytesIO()
                    pil_img.save(out_io, format="JPEG", quality=quality, optimize=True)
                    new_img_bytes = out_io.getvalue()
                    
                    # Only replace if smaller
                    if len(new_img_bytes) < len(img_bytes):
                        doc.update_stream(xref, new_img_bytes)
            except Exception:
                continue

    out_bytes = doc.tobytes(
        garbage=4,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True,
        clean=True
    )
    doc.close()
    return out_bytes

def compress_pdf(pdf_bytes: bytes, mode: str = "recommended") -> tuple[bytes, int, int, float]:
    orig_size = len(pdf_bytes)
    
    # Try Ghostscript if available
    preset_map = {
        "extreme": "/screen",
        "recommended": "/ebook",
        "low": "/printer"
    }
    gs_preset = preset_map.get(mode, "/ebook")
    
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as in_f:
        in_f.write(pdf_bytes)
        in_path = in_f.name
        
    out_path = in_path + "_compressed.pdf"
    compressed_bytes = None
    
    try:
        if run_ghostscript_compress(in_path, out_path, gs_preset):
            with open(out_path, "rb") as out_f:
                gs_bytes = out_f.read()
            if len(gs_bytes) < orig_size:
                compressed_bytes = gs_bytes
    finally:
        for p in [in_path, out_path]:
            if os.path.exists(p):
                os.remove(p)
                
    # Fallback to PyMuPDF compression if GS failed or didn't compress sufficiently
    pymupdf_bytes = compress_pdf_pymupdf(pdf_bytes, mode)
    if compressed_bytes is None or len(pymupdf_bytes) < len(compressed_bytes):
        compressed_bytes = pymupdf_bytes
        
    final_size = len(compressed_bytes)
    savings_pct = round(((orig_size - final_size) / orig_size) * 100, 2) if orig_size > 0 else 0.0
    return compressed_bytes, orig_size, final_size, savings_pct

def optimize_pdf(pdf_bytes: bytes, remove_metadata: bool = True) -> tuple[bytes, int, int, float]:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    if remove_metadata:
        doc.set_metadata({})
    
    out_bytes = doc.tobytes(
        garbage=4,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True,
        clean=True
    )
    doc.close()
    
    orig_size = len(pdf_bytes)
    final_size = len(out_bytes)
    savings_pct = round(((orig_size - final_size) / orig_size) * 100, 2) if orig_size > 0 else 0.0
    return out_bytes, orig_size, final_size, savings_pct

def compress_for_email(pdf_bytes: bytes, target_mb: int = 2) -> tuple[bytes, int, int, float, bool]:
    orig_size = len(pdf_bytes)
    target_bytes = target_mb * 1024 * 1024
    
    if orig_size <= target_bytes:
        return pdf_bytes, orig_size, orig_size, 0.0, True
        
    # Try progressive modes: low -> recommended -> extreme
    for mode in ["low", "recommended", "extreme"]:
        comp_bytes, _, final_size, savings = compress_pdf(pdf_bytes, mode)
        if final_size <= target_bytes:
            return comp_bytes, orig_size, final_size, savings, True
            
    # If extreme didn't meet target, return extreme with target_met=False
    comp_bytes, _, final_size, savings = compress_pdf(pdf_bytes, "extreme")
    return comp_bytes, orig_size, final_size, savings, (final_size <= target_bytes)

def analyze_pdf_size(pdf_bytes: bytes) -> dict:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total_size = len(pdf_bytes)
    page_count = doc.page_count
    
    images_count = 0
    images_estimated_bytes = 0
    seen_xrefs = set()
    
    fonts = set()
    for page in doc:
        for img in page.get_images(full=True):
            xref = img[0]
            if xref not in seen_xrefs:
                seen_xrefs.add(xref)
                images_count += 1
                try:
                    raw = doc.extract_image(xref)
                    if raw and "image" in raw:
                        images_estimated_bytes += len(raw["image"])
                except Exception:
                    pass
        for font in page.get_fonts():
            fonts.add(font[3]) # font name
            
    metadata = doc.metadata or {}
    clean_metadata = {k: v for k, v in metadata.items() if v}
    
    content_stream_bytes = max(0, total_size - images_estimated_bytes)
    
    doc.close()
    return {
        "total_size": total_size,
        "page_count": page_count,
        "images_count": images_count,
        "images_size": images_estimated_bytes,
        "images_pct": round((images_estimated_bytes / total_size) * 100, 1) if total_size > 0 else 0,
        "content_and_fonts_size": content_stream_bytes,
        "fonts_count": len(fonts),
        "fonts_list": list(fonts)[:20],
        "metadata": clean_metadata
    }

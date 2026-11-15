import io
import pymupdf
from PIL import Image, ImageDraw, ImageFont

def hex_to_rgb(hex_code: str) -> tuple[float, float, float]:
    hex_code = hex_code.lstrip("#")
    if len(hex_code) == 3:
        hex_code = "".join(c * 2 for c in hex_code)
    if len(hex_code) != 6:
        return (0.0, 0.0, 0.0)
    r = int(hex_code[0:2], 16) / 255.0
    g = int(hex_code[2:4], 16) / 255.0
    b = int(hex_code[4:6], 16) / 255.0
    return (r, g, b)

def add_page_numbers(
    pdf_bytes: bytes,
    position: str = "bottom-center",
    start_number: int = 1,
    format_str: str = "Page {n} of {total}",
    font_size: int = 11,
    color_hex: str = "#333333",
    margin: int = 36,
    exclude_cover: bool = False
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total_pages = doc.page_count
    effective_total = total_pages - 1 if exclude_cover else total_pages
    color = hex_to_rgb(color_hex)

    for i, page in enumerate(doc):
        if exclude_cover and i == 0:
            continue
        
        current_num = start_number + (i - 1 if exclude_cover else i)
        text = format_str.replace("{n}", str(current_num)).replace("{total}", str(effective_total))
        rect = page.rect
        
        # Calculate text position
        text_len = pymupdf.get_text_length(text, fontsize=font_size)
        
        # Horizontal
        if "left" in position:
            x = margin
        elif "right" in position:
            x = rect.width - margin - text_len
        else: # center
            x = (rect.width - text_len) / 2.0
            
        # Vertical
        if "top" in position:
            y = margin + font_size
        else: # bottom
            y = rect.height - margin

        page.insert_text(pymupdf.Point(x, y), text, fontsize=font_size, color=color)

    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

def add_watermark(
    pdf_bytes: bytes,
    watermark_text: str = "",
    watermark_image_bytes: bytes | None = None,
    opacity: float = 0.3,
    rotation: int = 45,
    font_size: int = 48,
    color_hex: str = "#888888",
    pages: list[int] | None = None
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    target_pages = set(pages) if pages else set(range(1, doc.page_count + 1))
    color = hex_to_rgb(color_hex)

    # Pre-generate text watermark image if text is provided
    rendered_watermark_bytes = watermark_image_bytes
    if not rendered_watermark_bytes and watermark_text:
        alpha_val = int(max(0.05, min(1.0, opacity)) * 255)
        r, g, b = (int(c * 255) for c in color)
        canvas_w, canvas_h = 1000, 400
        txt_img = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_img)
        try:
            font = ImageFont.load_default(size=max(24, font_size * 2))
        except Exception:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        tx = (canvas_w - tw) / 2
        ty = (canvas_h - th) / 2
        draw.text((tx, ty), watermark_text, font=font, fill=(r, g, b, alpha_val))

        rotated_img = txt_img.rotate(rotation, expand=True, resample=Image.Resampling.BICUBIC)
        bio = io.BytesIO()
        rotated_img.save(bio, format="PNG")
        rendered_watermark_bytes = bio.getvalue()

    for p in range(1, doc.page_count + 1):
        if p in target_pages and rendered_watermark_bytes:
            page = doc[p - 1]
            rect = page.rect
            with Image.open(io.BytesIO(rendered_watermark_bytes)) as img:
                img_w, img_h = img.size
                max_w = rect.width * 0.85
                max_h = rect.height * 0.85
                scale = min(max_w / img_w, max_h / img_h, 1.0)
                w = img_w * scale
                h = img_h * scale
                x = (rect.width - w) / 2
                y = (rect.height - h) / 2
                img_rect = pymupdf.Rect(x, y, x + w, y + h)
                page.insert_image(img_rect, stream=rendered_watermark_bytes, overlay=True)

    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

def add_text_to_pdf(
    pdf_bytes: bytes,
    text: str,
    page_number: int = 1,
    x: float = 50.0,
    y: float = 50.0,
    font_size: int = 14,
    color_hex: str = "#000000"
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    if 1 <= page_number <= doc.page_count:
        page = doc[page_number - 1]
        color = hex_to_rgb(color_hex)
        page.insert_text(pymupdf.Point(x, y), text, fontsize=font_size, color=color)
    else:
        doc.close()
        raise ValueError(f"Page number {page_number} is out of range.")
        
    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

def add_image_to_pdf(
    pdf_bytes: bytes,
    image_bytes: bytes,
    page_number: int = 1,
    x: float = 50.0,
    y: float = 50.0,
    width: float = 150.0,
    height: float = 150.0
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    if 1 <= page_number <= doc.page_count:
        page = doc[page_number - 1]
        rect = pymupdf.Rect(x, y, x + width, y + height)
        page.insert_image(rect, stream=image_bytes)
    else:
        doc.close()
        raise ValueError(f"Page number {page_number} is out of range.")
        
    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

def crop_pdf(
    pdf_bytes: bytes,
    top_margin: float = 0,
    bottom_margin: float = 0,
    left_margin: float = 0,
    right_margin: float = 0,
    pages: list[int] | None = None
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    target_pages = set(pages) if pages else set(range(1, doc.page_count + 1))

    for p in range(1, doc.page_count + 1):
        if p in target_pages:
            page = doc[p - 1]
            rect = page.rect
            new_x0 = rect.x0 + left_margin
            new_y0 = rect.y0 + top_margin
            new_x1 = rect.x1 - right_margin
            new_y1 = rect.y1 - bottom_margin
            
            if new_x1 > new_x0 and new_y1 > new_y0:
                page.set_cropbox(pymupdf.Rect(new_x0, new_y0, new_x1, new_y1))

    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes

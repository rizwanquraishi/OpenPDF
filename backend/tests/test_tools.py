import io
import pytest
from fastapi.testclient import TestClient
import pymupdf
from PIL import Image
from app.main import app

client = TestClient(app)

def create_sample_pdf(page_count: int = 3, text_prefix: str = "Test Page") -> bytes:
    doc = pymupdf.open()
    for i in range(1, page_count + 1):
        page = doc.new_page(width=595, height=842)
        page.insert_text((72, 72), f"{text_prefix} {i}", fontsize=18)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def create_sample_image(format_type: str = "PNG") -> bytes:
    img = Image.new("RGB", (200, 200), color=(255, 0, 0))
    bio = io.BytesIO()
    img.save(bio, format=format_type)
    return bio.getvalue()

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

def test_merge_pdf():
    pdf1 = create_sample_pdf(2, "Doc 1 Page")
    pdf2 = create_sample_pdf(2, "Doc 2 Page")
    
    files = [
        ("files", ("doc1.pdf", pdf1, "application/pdf")),
        ("files", ("doc2.pdf", pdf2, "application/pdf")),
    ]
    res = client.post("/api/merge", files=files)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc.page_count == 4
    doc.close()

def test_split_pdf():
    pdf = create_sample_pdf(4, "Page")
    res = client.post("/api/split", files={"file": ("test.pdf", pdf, "application/pdf")}, data={"mode": "all"})
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"

def test_extract_pages():
    pdf = create_sample_pdf(5, "Page")
    res = client.post(
        "/api/extract-pages",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"pages": "1,3,5"}
    )
    assert res.status_code == 200
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc.page_count == 3
    doc.close()

def test_delete_pages():
    pdf = create_sample_pdf(4, "Page")
    res = client.post(
        "/api/delete-pages",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"pages": "2,4"}
    )
    assert res.status_code == 200
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc.page_count == 2
    doc.close()

def test_rotate_pdf():
    pdf = create_sample_pdf(2, "Page")
    res = client.post(
        "/api/rotate",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"angle": 90, "pages": "1"}
    )
    assert res.status_code == 200
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc[0].rotation == 90
    assert doc[1].rotation == 0
    doc.close()

def test_reorder_pdf():
    pdf = create_sample_pdf(3, "Page")
    res = client.post(
        "/api/reorder",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"order": "3,1,2"}
    )
    assert res.status_code == 200
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc.page_count == 3
    assert "Page 3" in doc[0].get_text()
    assert "Page 1" in doc[1].get_text()
    doc.close()

def test_compress_pdf():
    pdf = create_sample_pdf(3, "Compress Page")
    res = client.post(
        "/api/compress",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"mode": "recommended"}
    )
    assert res.status_code == 200
    assert "X-Final-Size" in res.headers

def test_optimize_pdf():
    pdf = create_sample_pdf(3, "Optimize Page")
    res = client.post(
        "/api/optimize",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"remove_metadata": "true"}
    )
    assert res.status_code == 200

def test_analyze_size():
    pdf = create_sample_pdf(3, "Analyze Page")
    res = client.post(
        "/api/analyze-size",
        files={"file": ("test.pdf", pdf, "application/pdf")}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["page_count"] == 3
    assert "total_size" in data

def test_pdf_to_word():
    pdf = create_sample_pdf(2, "Word Page")
    res = client.post(
        "/api/pdf-to-word",
        files={"file": ("test.pdf", pdf, "application/pdf")}
    )
    assert res.status_code == 200
    assert len(res.content) > 0

def test_pdf_to_excel():
    pdf = create_sample_pdf(2, "ColA   ColB   ColC")
    res = client.post(
        "/api/pdf-to-excel",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"export_format": "xlsx"}
    )
    assert res.status_code == 200
    assert len(res.content) > 0

def test_pdf_to_powerpoint():
    pdf = create_sample_pdf(2, "Slide Page")
    res = client.post(
        "/api/pdf-to-powerpoint",
        files={"file": ("test.pdf", pdf, "application/pdf")}
    )
    assert res.status_code == 200
    assert len(res.content) > 0

def test_pdf_to_jpg_and_png():
    pdf = create_sample_pdf(2, "Image Page")
    res_jpg = client.post("/api/pdf-to-jpg", files={"file": ("test.pdf", pdf, "application/pdf")})
    assert res_jpg.status_code == 200
    res_png = client.post("/api/pdf-to-png", files={"file": ("test.pdf", pdf, "application/pdf")})
    assert res_png.status_code == 200

def test_pdf_to_txt():
    pdf = create_sample_pdf(2, "Text Extracted")
    res = client.post("/api/pdf-to-txt", files={"file": ("test.pdf", pdf, "application/pdf")})
    assert res.status_code == 200
    assert "Text Extracted" in res.text

def test_image_to_pdf():
    img1 = create_sample_image("PNG")
    img2 = create_sample_image("JPEG")
    files = [
        ("files", ("img1.png", img1, "image/png")),
        ("files", ("img2.jpg", img2, "image/jpeg"))
    ]
    res = client.post("/api/png-to-pdf", files=files)
    assert res.status_code == 200
    doc = pymupdf.open(stream=res.content, filetype="pdf")
    assert doc.page_count == 2
    doc.close()

def test_page_numbers():
    pdf = create_sample_pdf(3, "Numbering Page")
    res = client.post(
        "/api/page-numbers",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"position": "bottom-center", "format_str": "Page {n} of {total}"}
    )
    assert res.status_code == 200

def test_watermark():
    pdf = create_sample_pdf(2, "Watermark Page")
    res = client.post(
        "/api/watermark",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"watermark_text": "CONFIDENTIAL"}
    )
    assert res.status_code == 200

def test_add_text():
    pdf = create_sample_pdf(2, "Base Page")
    res = client.post(
        "/api/add-text",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"text": "Added Signature", "page_number": 1, "x": 100, "y": 100}
    )
    assert res.status_code == 200

def test_crop_pdf():
    pdf = create_sample_pdf(2, "Crop Page")
    res = client.post(
        "/api/crop",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"top_margin": 50, "bottom_margin": 50, "left_margin": 50, "right_margin": 50}
    )
    assert res.status_code == 200

def test_protect_and_unlock_pdf():
    pdf = create_sample_pdf(2, "Secret Content")
    
    # 1. Protect PDF
    res_protect = client.post(
        "/api/protect",
        files={"file": ("test.pdf", pdf, "application/pdf")},
        data={"password": "MySuperSecretPassword"}
    )
    assert res_protect.status_code == 200
    protected_bytes = res_protect.content
    
    # Verify that the document is locked
    doc_locked = pymupdf.open(stream=protected_bytes, filetype="pdf")
    assert doc_locked.is_encrypted
    doc_locked.close()
    
    # 2. Try unlock with wrong password
    res_wrong = client.post(
        "/api/unlock",
        files={"file": ("protected.pdf", protected_bytes, "application/pdf")},
        data={"password": "wrongpassword"}
    )
    assert res_wrong.status_code == 400
    
    # 3. Unlock with correct password
    res_unlock = client.post(
        "/api/unlock",
        files={"file": ("protected.pdf", protected_bytes, "application/pdf")},
        data={"password": "MySuperSecretPassword"}
    )
    assert res_unlock.status_code == 200
    doc_unlocked = pymupdf.open(stream=res_unlock.content, filetype="pdf")
    assert not doc_unlocked.is_encrypted or doc_unlocked.authenticate("") >= 0
    assert "Secret Content" in doc_unlocked[0].get_text()
    doc_unlocked.close()

def test_office_conversions():
    import docx
    import openpyxl

    # Test docx to pdf
    doc = docx.Document()
    doc.add_heading("OpenPDF Test Office Docx", level=1)
    doc.add_paragraph("This is a paragraph inside the Word document.")
    bio_docx = io.BytesIO()
    doc.save(bio_docx)

    res_docx = client.post(
        "/api/word-to-pdf",
        files={"file": ("sample.docx", bio_docx.getvalue(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    assert res_docx.status_code == 200
    assert res_docx.headers["content-type"] == "application/pdf"
    doc_res = pymupdf.open(stream=res_docx.content, filetype="pdf")
    assert doc_res.page_count >= 1
    doc_res.close()

    # Test xlsx to pdf
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Summary"
    ws.append(["Item", "Price", "Qty"])
    ws.append(["PDF Tool", 0, 30])
    bio_xlsx = io.BytesIO()
    wb.save(bio_xlsx)

    res_xlsx = client.post(
        "/api/excel-to-pdf",
        files={"file": ("sample.xlsx", bio_xlsx.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )
    assert res_xlsx.status_code == 200
    assert res_xlsx.headers["content-type"] == "application/pdf"
    doc_res_xlsx = pymupdf.open(stream=res_xlsx.content, filetype="pdf")
    assert doc_res_xlsx.page_count >= 1
    doc_res_xlsx.close()


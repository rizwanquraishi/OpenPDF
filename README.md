# OpenPDF – All-in-One PDF Tools Platform

**OpenPDF** is a modern, fast, secure, and 100% free online PDF processing platform. Built with Next.js 14, TypeScript, Tailwind CSS, Python FastAPI, PyMuPDF, and LibreOffice, it features **exactly 30 genuinely working PDF utilities** with zero registration, zero subscription plans, and automated file cleanup.

---

## 🚀 Key Highlights

- **30 Functional Tools:** Every published tool has complete processing logic (client-side or server-side).
- **Hybrid Architecture:** Client-side WebAssembly/JavaScript manipulation using `pdf-lib` for instant client processing, plus a Python FastAPI backend for high-fidelity office conversion and Ghostscript compression.
- **Privacy First:** User documents uploaded to the server are placed into isolated UUID job directories and purged by a background task within 30 minutes.
- **No Passwords Stored:** PDF password encryption and decryption run in memory without logging or persisting credentials.
- **SEO & Mobile Ready:** Dedicated indexable pages for all 30 tools with metadata, breadcrumbs, step-by-step instructions, and FAQs.

---

## 🛠️ Complete Registry of 30 Tools

### Category A: Organize PDF
1. **Merge PDF** (`/merge-pdf`): Combine multiple PDF documents in any custom order.
2. **Split PDF** (`/split-pdf`): Split by page ranges, every N pages, or extract all pages as a ZIP.
3. **Organize PDF** (`/organize-pdf`): Visually manage, rotate, duplicate, and delete pages.
4. **Extract PDF Pages** (`/extract-pdf-pages`): Pull out selected pages or intervals into a clean PDF.
5. **Delete PDF Pages** (`/delete-pdf-pages`): Remove individual pages or ranges from a document.
6. **Rotate PDF** (`/rotate-pdf`): Rotate pages 90° CW, 180°, or 90° CCW permanently.
7. **Reorder PDF Pages** (`/reorder-pdf-pages`): Rearrange the sequence of PDF pages.
8. **Remove Blank Pages** (`/remove-blank-pages`): Auto-detect empty or blank scanned pages with review before deletion.

### Category B: Compress & Optimize PDF
9. **Compress PDF** (`/compress-pdf`): Reduce file size with Low, Recommended, and Extreme modes.
10. **Optimize PDF** (`/optimize-pdf`): Strip orphan objects, deduplicate streams, and clean metadata.
11. **Compress PDF for Email** (`/compress-pdf-for-email`): Auto-tune file size for email presets (1MB, 2MB, 5MB, 10MB).
12. **PDF Size Analyzer** (`/pdf-size-analyzer`): Inspect internal breakdown of embedded images, fonts, and streams.

### Category C: PDF Conversion
13. **PDF to Word** (`/pdf-to-word`): Convert PDF into editable `.docx` documents.
14. **PDF to Excel** (`/pdf-to-excel`): Extract structured tables into `.xlsx` and `.csv`.
15. **PDF to PowerPoint** (`/pdf-to-powerpoint`): Turn PDF pages into PowerPoint `.pptx` slides.
16. **PDF to JPG** (`/pdf-to-jpg`): Render PDF pages to high-resolution JPG images or batch ZIP.
17. **PDF to PNG** (`/pdf-to-png`): Render PDF pages to lossless PNG images.
18. **PDF to TXT** (`/pdf-to-txt`): Extract clean text content with page markers.
19. **JPG to PDF** (`/jpg-to-pdf`): Convert photos into a formatted PDF document.
20. **PNG to PDF** (`/png-to-pdf`): Convert PNG graphics into a PDF with margin controls.
21. **Word to PDF** (`/word-to-pdf`): Convert `.docx` and `.doc` files to PDF via LibreOffice.
22. **Excel to PDF** (`/excel-to-pdf`): Convert `.xlsx` spreadsheets to PDF via LibreOffice.
23. **PowerPoint to PDF** (`/powerpoint-to-pdf`): Convert `.pptx` presentations to PDF via LibreOffice.

### Category D: PDF Editing
24. **Add Page Numbers** (`/add-page-numbers`): Add customized page numbers with position, start number, and cover page exclusion.
25. **Add Watermark** (`/add-watermark`): Stamp text or logo watermarks with opacity and rotation controls.
26. **Add Text to PDF** (`/add-text-to-pdf`): Insert custom text annotations with position, font size, and color.
27. **Add Image to PDF** (`/add-image-to-pdf`): Insert signatures, stamps, or photos onto any PDF page.
28. **Crop PDF** (`/crop-pdf`): Trim unwanted margins and borders from pages.

### Category E: PDF Security
29. **Protect PDF** (`/protect-pdf`): Add bank-grade AES password encryption with granular permissions.
30. **Unlock PDF** (`/unlock-pdf`): Remove password restrictions when authorized.

---

## 🏗️ Architecture & Tech Stack

```
openpdf/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint, CORS, lifespan
│   │   ├── config.py         # Configs (upload limits, storage, retention)
│   │   ├── routers/          # Modular API routers for each category
│   │   ├── services/         # PyMuPDF, pypdf, Pillow, LibreOffice integrations
│   │   └── utils/            # Magic bytes validation, cleanup daemon
│   └── tests/
│       └── test_tools.py     # Automated pytest suite (22 test suites)
│
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Homepage with Hero, Search, Popular Tools, FAQs
│   │   │   ├── tools/        # Complete 30-tool directory
│   │   │   ├── [tool_slug]/  # Dedicated SEO pages for each of the 30 tools
│   │   │   ├── about/        # About & Mission
│   │   │   ├── privacy/      # Comprehensive Privacy Policy
│   │   │   ├── terms/        # Terms of Service
│   │   │   ├── security/     # Security Architecture
│   │   │   ├── contact/      # Contact & Feedback Form
│   │   │   ├── sitemap.ts    # Dynamic XML Sitemap
│   │   │   └── robots.ts     # Search engine robots directives
│   │   ├── components/       # Layout, Navigation, Upload, ToolOptions, Results
│   │   ├── lib/              # Client PDF operations (pdf-lib), API client, tools registry
│   │   └── types/            # TypeScript schemas
│   └── tailwind.config.ts    # OpenPDF design system & brand theme
│
├── run_backend.sh            # Start backend server (port 8000)
├── run_frontend.sh           # Start frontend server (port 3000)
└── start.sh                  # Start both servers together
```

---

## ⚡ Quick Start

### 1. Start Both Backend & Frontend
```bash
./start.sh
```
- Open your browser at: `http://localhost:3000`
- API documentation at: `http://localhost:8000/docs`

### 2. Running Backend Tests
```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest tests/test_tools.py -v
```
All 22 test suites will run and verify every endpoint and document conversion operation.

### 3. Building Frontend for Production
```bash
cd frontend
npm run build
npm start
```

---

## 🔒 Security & Privacy Notice
- OpenPDF does **not** permanently store uploaded documents.
- Ephemeral job directories in `/tmp/openpdf_jobs` are automatically cleaned up every 10 minutes (files older than 30 minutes are removed).
- No mandatory accounts, no subscriptions, no tracking.

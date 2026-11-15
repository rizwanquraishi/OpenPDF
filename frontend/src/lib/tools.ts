import { ToolDefinition, ToolCategory } from '@/types/tool';

export const CATEGORIES: { id: ToolCategory; name: string; description: string }[] = [
  { id: 'organize', name: 'Organize PDF', description: 'Merge, split, extract, rotate, and arrange pages.' },
  { id: 'optimize', name: 'Optimize PDF', description: 'Compress, optimize, reduce size for email, and analyze.' },
  { id: 'convert', name: 'Convert PDF', description: 'Convert to and from Word, Excel, PowerPoint, JPG, and PNG.' },
  { id: 'edit', name: 'Edit PDF', description: 'Add page numbers, watermark, custom text, images, and crop.' },
  { id: 'security', name: 'PDF Security', description: 'Protect your PDFs with passwords or unlock existing ones.' },
];

export const TOOLS: ToolDefinition[] = [
  // --- CATEGORY A: ORGANIZE PDF ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'organize',
    shortDescription: 'Combine multiple PDFs into one unified document in seconds.',
    description: 'Merge multiple PDF files into a single, organized document. Arrange files in any order and combine instantly.',
    popular: true,
    icon: 'Layers',
    accept: '.pdf,application/pdf',
    multiple: true,
    endpoint: '/api/merge',
    clientSide: true,
    metaTitle: 'Merge PDF - Combine PDF Files Online for Free | OpenPDF',
    metaDescription: 'Easily combine multiple PDF files into one single PDF document online. 100% free, fast, and secure with no file limits.',
    howTo: [
      'Click Select PDF Files or drag and drop your PDFs into the upload area.',
      'Reorder files if needed by dragging them into your preferred sequence.',
      'Click the Merge PDF button to start combining.',
      'Download your merged PDF file instantly.'
    ],
    faqs: [
      { q: 'Is there a limit on how many files I can merge?', a: 'No, you can merge multiple PDF documents simultaneously without limits.' },
      { q: 'Will my original document quality be preserved?', a: 'Yes, OpenPDF preserves all original text, vectors, images, and formatting during merging.' }
    ],
    relatedTools: ['split-pdf', 'organize-pdf', 'reorder-pdf-pages', 'compress-pdf']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'organize',
    shortDescription: 'Divide a PDF into separate files by page ranges or individual pages.',
    description: 'Separate one or more pages from your PDF document. Split by page range, every N pages, or extract all pages as a ZIP.',
    popular: true,
    icon: 'Split',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/split',
    clientSide: true,
    metaTitle: 'Split PDF - Separate PDF Pages Online Free | OpenPDF',
    metaDescription: 'Split PDF files by page ranges, every N pages, or separate all pages into individual files. Fast and free.',
    howTo: [
      'Select and upload the PDF file you wish to split.',
      'Choose your split mode: Split All Pages, Page Ranges (e.g., 1-3, 4-6), or Every N Pages.',
      'Click Split PDF to process your document.',
      'Download your individual PDF or ZIP archive.'
    ],
    faqs: [
      { q: 'Can I split specific page ranges like 1-3 and 5-8?', a: 'Yes, simply choose the Custom Ranges option and enter your desired page intervals separated by commas.' },
      { q: 'How do I download multiple split documents?', a: 'When splitting results in multiple files, OpenPDF automatically packages them into a convenient ZIP archive.' }
    ],
    relatedTools: ['extract-pdf-pages', 'delete-pdf-pages', 'merge-pdf', 'organize-pdf']
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    category: 'organize',
    shortDescription: 'Visually sort, rotate, duplicate, and delete pages inside your PDF.',
    description: 'A visual page manager for your document. Easily reorder pages, rotate sideways pages, delete unwanted pages, or duplicate pages.',
    popular: false,
    icon: 'LayoutGrid',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/organize',
    clientSide: true,
    metaTitle: 'Organize PDF - Reorder, Rotate & Delete Pages Visually | OpenPDF',
    metaDescription: 'Manage and organize pages in your PDF visually. Reorder, rotate, delete, or duplicate pages effortlessly.',
    howTo: [
      'Upload your PDF document to load all page thumbnails.',
      'Drag and drop pages to reorder them.',
      'Click the rotate icon to orient pages or trash icon to remove unwanted pages.',
      'Click Save & Download to export your newly organized PDF.'
    ],
    faqs: [
      { q: 'Does OpenPDF upload my document to the server for visual organization?', a: 'Page organization can be performed entirely in your browser using client-side processing for ultimate speed and privacy.' }
    ],
    relatedTools: ['reorder-pdf-pages', 'delete-pdf-pages', 'rotate-pdf', 'extract-pdf-pages']
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'organize',
    shortDescription: 'Extract selected pages or ranges into a brand new PDF document.',
    description: 'Pull out specific pages from a large document into a new clean PDF. Enter page numbers or click thumbnails.',
    popular: false,
    icon: 'FileOutput',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/extract-pages',
    clientSide: true,
    metaTitle: 'Extract PDF Pages - Save Specific Pages to New PDF | OpenPDF',
    metaDescription: 'Extract specific pages from your PDF file and save them into a new document. Free and instant.',
    howTo: [
      'Upload your PDF document.',
      'Specify the pages you wish to extract (e.g. 1, 3, 5-7).',
      'Click Extract Pages to generate your new document.',
      'Download your extracted PDF immediately.'
    ],
    faqs: [
      { q: 'Does extracting pages modify the original PDF?', a: 'No, your original file remains untouched. A new document containing only the extracted pages is created.' }
    ],
    relatedTools: ['split-pdf', 'delete-pdf-pages', 'organize-pdf']
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'organize',
    shortDescription: 'Remove unwanted pages and download a clean, trimmed PDF.',
    description: 'Quickly remove excess or blank pages from your PDF document. Select pages to delete and save.',
    popular: false,
    icon: 'Trash2',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/delete-pages',
    clientSide: true,
    metaTitle: 'Delete PDF Pages - Remove Pages from PDF Online | OpenPDF',
    metaDescription: 'Remove unwanted pages from your PDF file online. Delete individual pages or page ranges easily.',
    howTo: [
      'Upload the PDF file from your device.',
      'Enter page numbers or click the pages you want to remove.',
      'Click Delete Pages to process.',
      'Download your trimmed PDF.'
    ],
    faqs: [
      { q: 'Can I delete multiple pages at once?', a: 'Yes, you can enter comma-separated numbers like 2, 4, 6 or ranges like 2-5.' }
    ],
    relatedTools: ['remove-blank-pages', 'organize-pdf', 'extract-pdf-pages']
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'organize',
    shortDescription: 'Rotate individual pages or your entire PDF document permanently.',
    description: 'Fix upside-down or sideways PDF pages. Rotate 90 degrees clockwise, counterclockwise, or 180 degrees.',
    popular: false,
    icon: 'RotateCw',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/rotate',
    clientSide: true,
    metaTitle: 'Rotate PDF - Rotate PDF Pages Permanently Online | OpenPDF',
    metaDescription: 'Rotate PDF pages permanently. Rotate 90, 180, or 270 degrees clockwise or counterclockwise online.',
    howTo: [
      'Upload the PDF document you want to rotate.',
      'Choose rotation angle (90° CW, 180°, 90° CCW).',
      'Choose whether to apply to all pages or specific pages.',
      'Click Rotate PDF and download.'
    ],
    faqs: [
      { q: 'Will the rotation remain permanent when opened in Acrobat or a browser?', a: 'Yes, the page orientation metadata is saved permanently into the PDF.' }
    ],
    relatedTools: ['organize-pdf', 'reorder-pdf-pages', 'crop-pdf']
  },
  {
    id: 'reorder-pdf-pages',
    name: 'Reorder PDF Pages',
    category: 'organize',
    shortDescription: 'Change the sequence and order of pages in your PDF document.',
    description: 'Rearrange PDF pages in any custom sequence. Move pages left, right, first, or last with intuitive controls.',
    popular: false,
    icon: 'ArrowUpDown',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/reorder',
    clientSide: true,
    metaTitle: 'Reorder PDF Pages - Change PDF Page Order Online | OpenPDF',
    metaDescription: 'Easily rearrange and reorder PDF pages online. Put pages in any custom order and download.',
    howTo: [
      'Upload your PDF file.',
      'Specify the new sequence order (e.g. 3, 1, 2) or drag pages.',
      'Click Reorder Pages.',
      'Download the rearranged document.'
    ],
    faqs: [
      { q: 'Can I undo my changes if I make a mistake?', a: 'Yes, you can reset the order back to the original layout at any time.' }
    ],
    relatedTools: ['organize-pdf', 'rotate-pdf', 'delete-pdf-pages']
  },
  {
    id: 'remove-blank-pages',
    name: 'Remove Blank Pages',
    category: 'organize',
    shortDescription: 'Detect and eliminate blank or empty pages from scanned PDFs.',
    description: 'Automatically scan documents for empty pages with little or no content. Review detected blank pages before removing them.',
    popular: false,
    icon: 'FileX',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/remove-blank-pages',
    clientSide: true,
    metaTitle: 'Remove Blank Pages from PDF - Auto Detect & Clean | OpenPDF',
    metaDescription: 'Automatically detect and remove blank pages from your scanned PDF documents. Review detected pages before deleting.',
    howTo: [
      'Upload your PDF document.',
      'The tool scans and flags detected blank pages.',
      'Review the flagged pages to confirm.',
      'Click Remove Blank Pages and download the cleaned PDF.'
    ],
    faqs: [
      { q: 'Will it accidentally delete pages with light pencil or faint text?', a: 'No, OpenPDF displays the detected pages for your review before deletion so you have full control.' }
    ],
    relatedTools: ['delete-pdf-pages', 'organize-pdf', 'compress-pdf']
  },

  // --- CATEGORY B: COMPRESS & OPTIMIZE PDF ---
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'optimize',
    shortDescription: 'Significantly reduce PDF file size while retaining crystal clear quality.',
    description: 'Reduce the file size of your PDF documents with customizable compression levels: Low, Recommended, and Extreme.',
    popular: true,
    icon: 'Minimize2',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/compress',
    metaTitle: 'Compress PDF - Reduce PDF File Size Online Free | OpenPDF',
    metaDescription: 'Compress PDF files online with maximum quality preservation. Choose from Low, Recommended, or Extreme compression.',
    howTo: [
      'Upload the PDF you want to compress.',
      'Select your preferred compression mode (Recommended, Low, or Extreme).',
      'Click Compress PDF to start processing.',
      'View your file size savings and download your optimized PDF.'
    ],
    faqs: [
      { q: 'How much can I reduce my PDF size?', a: 'Depending on the images and streams in your document, file size is typically reduced by 40% to 85%.' },
      { q: 'Does compression compromise text clarity?', a: 'Vector text and fonts remain 100% sharp; only embedded bitmap images are intelligently re-sampled.' }
    ],
    relatedTools: ['compress-pdf-for-email', 'optimize-pdf', 'pdf-size-analyzer']
  },
  {
    id: 'optimize-pdf',
    name: 'Optimize PDF',
    category: 'optimize',
    shortDescription: 'Streamline PDF structure, clean unused objects, and optimize streams.',
    description: 'Clean up bloated PDF internals. Strips orphan objects, optimizes internal streams, cleans metadata, and speeds up web rendering.',
    popular: false,
    icon: 'Sparkles',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/optimize',
    metaTitle: 'Optimize PDF - Clean Structure & Fast Web View | OpenPDF',
    metaDescription: 'Optimize PDF documents for web loading and viewing. Remove dead objects and compress internal streams.',
    howTo: [
      'Select and upload your PDF.',
      'Choose whether to strip non-essential metadata.',
      'Click Optimize PDF.',
      'Download your streamlined document.'
    ],
    faqs: [
      { q: 'What is the difference between Compress and Optimize?', a: 'Compress focuses heavily on resizing raster images, while Optimize cleans structural overhead and duplicate font streams.' }
    ],
    relatedTools: ['compress-pdf', 'pdf-size-analyzer', 'compress-pdf-for-email']
  },
  {
    id: 'compress-pdf-for-email',
    name: 'Compress PDF for Email',
    category: 'optimize',
    shortDescription: 'Target specific email attachment sizes: 1 MB, 2 MB, 5 MB, or 10 MB.',
    description: 'Prepare your large PDFs for email attachment limits. Select your target size and OpenPDF automatically achieves the best possible compression.',
    popular: false,
    icon: 'Mail',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/compress-email',
    metaTitle: 'Compress PDF for Email - Target 1MB, 2MB, 5MB Limits | OpenPDF',
    metaDescription: 'Compress PDF files to meet email attachment limits. Target 1MB, 2MB, 5MB, or 10MB presets with smart auto-tuning.',
    howTo: [
      'Upload the PDF you need to email.',
      'Choose your target maximum size (1 MB, 2 MB, 5 MB, or 10 MB).',
      'Click Compress for Email.',
      'Check the final size report and download.'
    ],
    faqs: [
      { q: 'What is standard email attachment limit?', a: 'Most email providers like Gmail and Outlook allow up to 25 MB, but corporate servers frequently limit incoming files to 5 MB or 10 MB.' }
    ],
    relatedTools: ['compress-pdf', 'optimize-pdf', 'pdf-size-analyzer']
  },
  {
    id: 'pdf-size-analyzer',
    name: 'PDF Size Analyzer',
    category: 'optimize',
    shortDescription: 'Inspect what makes your PDF heavy: images, fonts, metadata, and pages.',
    description: 'Deeply inspect what causes your PDF to be large. Get a detailed breakdown of embedded images, font weights, page count, and stream sizes.',
    popular: false,
    icon: 'PieChart',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/analyze-size',
    metaTitle: 'PDF Size Analyzer - Inspect Image, Font & Resource Weights | OpenPDF',
    metaDescription: 'Analyze the breakdown of your PDF document size. View image counts, font overhead, and content streams.',
    howTo: [
      'Upload the PDF you want to analyze.',
      'OpenPDF inspects all internal objects and streams.',
      'View the visual breakdown of images, fonts, and pages.',
      'Proceed with targeted compression or optimization.'
    ],
    faqs: [
      { q: 'Can this help me decide which compression mode to use?', a: 'Yes! If images take up 90% of the size, standard image compression will yield massive savings.' }
    ],
    relatedTools: ['compress-pdf', 'optimize-pdf', 'compress-pdf-for-email']
  },

  // --- CATEGORY C: PDF CONVERSION ---
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'convert',
    shortDescription: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
    description: 'Turn your PDF documents into editable Word files with accurate layout, paragraph flow, and tables preserved.',
    popular: true,
    icon: 'FileText',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-word',
    metaTitle: 'PDF to Word Converter - Free Online PDF to DOCX | OpenPDF',
    metaDescription: 'Convert PDF to editable Word DOCX documents for free online. Preserves text formatting, images, and tables.',
    howTo: [
      'Upload the PDF you want to convert to Word.',
      'Click Convert to Word.',
      'Wait a moment while the layout and text are reconstructed.',
      'Download your editable .docx document.'
    ],
    faqs: [
      { q: 'Can I edit the output Word document in Microsoft Office or Google Docs?', a: 'Yes, the resulting .docx file is 100% compatible with MS Word, LibreOffice, and Google Docs.' }
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-txt']
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'convert',
    shortDescription: 'Extract tables and tabular data into editable Excel (.xlsx) spreadsheets.',
    description: 'Automatically detect and extract data tables from PDF reports, statements, and invoices into clean Excel and CSV formats.',
    popular: false,
    icon: 'Table',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-excel',
    metaTitle: 'PDF to Excel Converter - Extract PDF Tables to XLSX | OpenPDF',
    metaDescription: 'Convert PDF tables into editable Excel (.xlsx) spreadsheets online. Fast table extraction to Excel and CSV.',
    howTo: [
      'Upload your PDF containing tables or rows of data.',
      'Choose output format (Excel .xlsx or CSV).',
      'Click Convert to Excel.',
      'Download your organized spreadsheet.'
    ],
    faqs: [
      { q: 'Are multiple tables separated into distinct sheets?', a: 'Yes, each detected table is placed on its own sheet with page numbers clearly labeled.' }
    ],
    relatedTools: ['excel-to-pdf', 'pdf-to-word', 'pdf-to-txt']
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    category: 'convert',
    shortDescription: 'Convert PDF presentation slides into editable PowerPoint (.pptx) decks.',
    description: 'Turn PDF slides and pitch decks into PowerPoint presentations. Maintains original aspect ratios and dimensions.',
    popular: false,
    icon: 'Presentation',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-powerpoint',
    metaTitle: 'PDF to PowerPoint Converter - PDF to PPTX Online | OpenPDF',
    metaDescription: 'Convert PDF presentation slides into Microsoft PowerPoint PPTX decks online. Free and accurate.',
    howTo: [
      'Upload your PDF presentation.',
      'Click Convert to PowerPoint.',
      'Download your generated .pptx slide deck.'
    ],
    faqs: [
      { q: 'Does it support widescreen (16:9) slides?', a: 'Yes, OpenPDF automatically reads the exact dimensions of each PDF page and sets the PowerPoint slide dimensions to match.' }
    ],
    relatedTools: ['powerpoint-to-pdf', 'pdf-to-word', 'pdf-to-jpg']
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'convert',
    shortDescription: 'Extract or render PDF pages into high-resolution JPG images.',
    description: 'Convert every page of your PDF into crisp JPG pictures. Download individual images or all pages in a single ZIP.',
    popular: false,
    icon: 'Image',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-jpg',
    metaTitle: 'PDF to JPG - Convert PDF Pages to JPG Images Online | OpenPDF',
    metaDescription: 'Convert PDF pages into high-resolution JPG images. Download single images or batch ZIP for free.',
    howTo: [
      'Upload the PDF document you want to convert.',
      'Select desired resolution (Standard 150 DPI or High 300 DPI).',
      'Click Convert to JPG.',
      'Download images or the complete ZIP archive.'
    ],
    faqs: [
      { q: 'Can I convert only specific pages?', a: 'Yes, you can specify page numbers like 1, 3, 5.' }
    ],
    relatedTools: ['pdf-to-png', 'jpg-to-pdf', 'pdf-to-word']
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'convert',
    shortDescription: 'Render PDF pages into lossless, transparent-capable PNG images.',
    description: 'Convert PDF pages into lossless PNG graphics with ultra-sharp text and graphic clarity. Ideal for presentations and publishing.',
    popular: false,
    icon: 'FileImage',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-png',
    metaTitle: 'PDF to PNG Converter - High Resolution Lossless PNG | OpenPDF',
    metaDescription: 'Convert PDF to high quality PNG images online. Lossless rendering with custom DPI options.',
    howTo: [
      'Upload your PDF file.',
      'Choose image resolution (150 DPI or 300 DPI).',
      'Click Convert to PNG.',
      'Download your images or ZIP.'
    ],
    faqs: [
      { q: 'Why choose PNG over JPG?', a: 'PNG uses lossless compression, meaning text edges and vector graphics remain razor sharp with no compression artifacts.' }
    ],
    relatedTools: ['pdf-to-jpg', 'png-to-pdf', 'crop-pdf']
  },
  {
    id: 'pdf-to-txt',
    name: 'PDF to TXT',
    category: 'convert',
    shortDescription: 'Extract all readable text from your PDF into a clean plain text file.',
    description: 'Pull all text from your document without any formatting distractions. Great for coding, analysis, text mining, or reading on any device.',
    popular: false,
    icon: 'FileCode',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/pdf-to-txt',
    metaTitle: 'PDF to TXT - Extract Text from PDF Online Free | OpenPDF',
    metaDescription: 'Extract plain text from PDF documents quickly and easily. Download TXT file with page demarcations.',
    howTo: [
      'Upload the PDF document.',
      'Click Extract Text.',
      'Download the formatted .txt file.'
    ],
    faqs: [
      { q: 'Does it preserve page numbers in the text?', a: 'Yes, each page is clearly labeled with a separator header for easy reference.' }
    ],
    relatedTools: ['pdf-to-word', 'pdf-to-excel']
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'convert',
    shortDescription: 'Convert one or multiple JPG images into a single organized PDF.',
    description: 'Combine photos, scans, and snapshots into a single polished PDF document. Customize page orientation, margins, and paper size.',
    popular: true,
    icon: 'FilePlus',
    accept: '.jpg,.jpeg,image/jpeg',
    multiple: true,
    endpoint: '/api/jpg-to-pdf',
    clientSide: true,
    metaTitle: 'JPG to PDF Converter - Convert Images to PDF Online | OpenPDF',
    metaDescription: 'Convert JPG images to PDF online for free. Combine multiple photos into one PDF with custom margins and layout.',
    howTo: [
      'Upload one or more JPG images.',
      'Arrange the image order by dragging.',
      'Select orientation (Portrait, Landscape, or Auto) and margin spacing.',
      'Click Convert to PDF and download.'
    ],
    faqs: [
      { q: 'Can I combine multiple pictures into one PDF?', a: 'Yes, you can upload dozens of photos and combine them into a single PDF album or document.' }
    ],
    relatedTools: ['png-to-pdf', 'pdf-to-jpg', 'merge-pdf']
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'convert',
    shortDescription: 'Convert PNG graphics and illustrations into high quality PDF files.',
    description: 'Turn PNG images into PDF format with full fidelity. Adjust paper orientation, margins, and combine multiple images seamlessly.',
    popular: false,
    icon: 'ImagePlus',
    accept: '.png,image/png',
    multiple: true,
    endpoint: '/api/png-to-pdf',
    clientSide: true,
    metaTitle: 'PNG to PDF - Convert PNG Images to PDF Online Free | OpenPDF',
    metaDescription: 'Convert PNG files into PDF documents. Preserve image clarity and adjust margins and orientation.',
    howTo: [
      'Upload your PNG images.',
      'Set margins and paper orientation.',
      'Click Convert to PDF.',
      'Download your PDF document.'
    ],
    faqs: [
      { q: 'Does it support transparency in PNGs?', a: 'Yes, transparent backgrounds render cleanly onto the white PDF page canvas.' }
    ],
    relatedTools: ['jpg-to-pdf', 'pdf-to-png', 'merge-pdf']
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'convert',
    shortDescription: 'Convert DOCX and DOC documents into standard, printer-ready PDFs.',
    description: 'Convert Microsoft Word documents (.docx, .doc) into reliable PDF documents. Layouts, fonts, and images are preserved exactly as designed.',
    popular: false,
    icon: 'FileCheck',
    accept: '.docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
    multiple: false,
    endpoint: '/api/word-to-pdf',
    metaTitle: 'Word to PDF Converter - Convert DOCX to PDF Online | OpenPDF',
    metaDescription: 'Convert Word DOCX documents to PDF online for free. Accurate layout and formatting preservation.',
    howTo: [
      'Upload your Word file (.docx or .doc).',
      'Click Convert to PDF.',
      'Download your ready-to-share PDF document.'
    ],
    faqs: [
      { q: 'Will my custom tables and headers look the same?', a: 'Yes, OpenPDF uses server-side office rendering engines to preserve page layout, headers, footers, and tables.' }
    ],
    relatedTools: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf']
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'convert',
    shortDescription: 'Convert Excel spreadsheets (.xlsx, .xls) into clean PDF sheets.',
    description: 'Convert Excel workbooks and spreadsheets into cleanly formatted PDF documents ready for printing, reporting, and sharing.',
    popular: false,
    icon: 'Sheet',
    accept: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
    multiple: false,
    endpoint: '/api/excel-to-pdf',
    metaTitle: 'Excel to PDF Converter - Convert XLSX to PDF Online | OpenPDF',
    metaDescription: 'Convert Excel (.xlsx, .xls) spreadsheets to PDF online. Easy sharing and printable sheets.',
    howTo: [
      'Upload your Excel spreadsheet.',
      'Click Convert to PDF.',
      'Download the converted PDF file.'
    ],
    faqs: [
      { q: 'Will cell formulas be calculated before rendering?', a: 'Yes, the rendered PDF reflects current evaluated cell values and table layouts.' }
    ],
    relatedTools: ['pdf-to-excel', 'word-to-pdf', 'powerpoint-to-pdf']
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'convert',
    shortDescription: 'Convert PowerPoint slide decks (.pptx, .ppt) into PDF handouts.',
    description: 'Convert presentation slides into locked, universally readable PDFs. Ideal for conference handouts, email pitch decks, and printing.',
    popular: false,
    icon: 'FileSpreadsheet',
    accept: '.pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint',
    multiple: false,
    endpoint: '/api/powerpoint-to-pdf',
    metaTitle: 'PowerPoint to PDF - Convert PPTX Slides to PDF Online | OpenPDF',
    metaDescription: 'Convert PowerPoint PPTX presentations to PDF online. Lock formatting and share presentation slides easily.',
    howTo: [
      'Upload your PowerPoint file (.pptx or .ppt).',
      'Click Convert to PDF.',
      'Download your PDF presentation document.'
    ],
    faqs: [
      { q: 'Does each slide become a page in the PDF?', a: 'Yes, each slide is converted into an individual page with matched proportions.' }
    ],
    relatedTools: ['pdf-to-powerpoint', 'word-to-pdf', 'excel-to-pdf']
  },

  // --- CATEGORY D: PDF EDITING ---
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    category: 'edit',
    shortDescription: 'Insert customized page numbers with full control over position and format.',
    description: 'Add page numbers into your PDF. Choose top or bottom position (left, center, right), starting number, format (e.g. Page {n} of {total}), and exclude cover page.',
    popular: false,
    icon: 'Hash',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/page-numbers',
    clientSide: true,
    metaTitle: 'Add Page Numbers to PDF - Customize Position & Format | OpenPDF',
    metaDescription: 'Insert page numbers into your PDF documents online. Select position, font size, format, and skip the cover page.',
    howTo: [
      'Upload your PDF document.',
      'Choose the position (e.g. Bottom Center, Bottom Right, Top Right).',
      'Select numbering format and whether to exclude the cover page.',
      'Click Add Page Numbers and download.'
    ],
    faqs: [
      { q: 'Can I omit the number on the title page?', a: 'Yes, check "Exclude Cover Page" to leave page 1 unnumbered and begin numbering from page 2.' }
    ],
    relatedTools: ['add-watermark', 'add-text-to-pdf', 'organize-pdf']
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    category: 'edit',
    shortDescription: 'Stamp customized text or company logo watermarks onto your PDF pages.',
    description: 'Protect document ownership or classify documents with custom text (e.g. CONFIDENTIAL, DRAFT) or image logos with opacity and angle controls.',
    popular: false,
    icon: 'Stamp',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/watermark',
    metaTitle: 'Add Watermark to PDF - Text & Logo Watermarks Online | OpenPDF',
    metaDescription: 'Add text or logo watermarks to PDF files online. Adjust opacity, font size, and rotation angle.',
    howTo: [
      'Upload your PDF document.',
      'Enter watermark text or upload a transparent PNG logo.',
      'Adjust opacity, rotation angle (e.g., 45°), and text color.',
      'Click Add Watermark and download.'
    ],
    faqs: [
      { q: 'Can I apply the watermark only to specific pages?', a: 'Yes, you can choose to apply it across all pages or specify page numbers.' }
    ],
    relatedTools: ['add-text-to-pdf', 'protect-pdf', 'add-page-numbers']
  },
  {
    id: 'add-text-to-pdf',
    name: 'Add Text to PDF',
    category: 'edit',
    shortDescription: 'Type and insert custom text, annotations, or dates into any PDF page.',
    description: 'Quickly insert text annotations, names, dates, or notes onto any page of your PDF document with custom positioning, font size, and color.',
    popular: true,
    icon: 'Type',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/add-text',
    clientSide: true,
    metaTitle: 'Add Text to PDF - Type & Insert Text Online Free | OpenPDF',
    metaDescription: 'Add text to PDF documents online. Type custom text, set position, font size, and color directly on any page.',
    howTo: [
      'Upload your PDF file.',
      'Enter the text you want to insert.',
      'Choose the target page number and specify X/Y position.',
      'Click Add Text and download the modified PDF.'
    ],
    faqs: [
      { q: 'Can I add multiple lines of text?', a: 'Yes, you can insert multi-line paragraphs or form notes.' }
    ],
    relatedTools: ['add-image-to-pdf', 'add-watermark', 'crop-pdf']
  },
  {
    id: 'add-image-to-pdf',
    name: 'Add Image to PDF',
    category: 'edit',
    shortDescription: 'Insert signatures, stamps, badges, or pictures onto PDF pages.',
    description: 'Place images, official stamps, or signature scans onto any page of your PDF document. Control positioning and dimensions.',
    popular: false,
    icon: 'Image',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/add-image',
    metaTitle: 'Add Image to PDF - Insert Signatures, Logos & Photos | OpenPDF',
    metaDescription: 'Insert images, stamps, signatures, or photos into PDF documents online. Fast, secure, and free.',
    howTo: [
      'Upload your base PDF document.',
      'Upload the image or signature file you want to insert.',
      'Set target page, dimensions, and location.',
      'Click Add Image and download.'
    ],
    faqs: [
      { q: 'Does it support transparent PNG signatures?', a: 'Yes, transparent PNG signatures overlay naturally on top of existing PDF text.' }
    ],
    relatedTools: ['add-text-to-pdf', 'add-watermark', 'protect-pdf']
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    category: 'edit',
    shortDescription: 'Trim unwanted white space and margins from PDF page borders.',
    description: 'Crop margins and extra white borders from PDF pages. Set top, bottom, left, and right margins to apply to single or all pages.',
    popular: false,
    icon: 'Crop',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/crop',
    clientSide: true,
    metaTitle: 'Crop PDF - Trim Page Margins & Borders Online | OpenPDF',
    metaDescription: 'Crop PDF pages online. Trim margins, remove unwanted whitespace, and adjust document dimensions.',
    howTo: [
      'Upload your PDF file.',
      'Specify crop margins in points (Top, Bottom, Left, Right).',
      'Select whether to apply to all pages or specific pages.',
      'Click Crop PDF and download.'
    ],
    faqs: [
      { q: 'Will cropping reduce the file size?', a: 'Cropping alters the visible viewport bounding box (cropbox) without discarding underlying vector data.' }
    ],
    relatedTools: ['rotate-pdf', 'organize-pdf', 'compress-pdf']
  },

  // --- CATEGORY E: PDF SECURITY ---
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'security',
    shortDescription: 'Encrypt your PDF with strong password protection and permissions.',
    description: 'Add bank-grade encryption to confidential PDF documents. Set password requirements and configure permissions for printing and copying.',
    popular: true,
    icon: 'Lock',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/protect',
    metaTitle: 'Protect PDF - Encrypt PDF with Password Online Free | OpenPDF',
    metaDescription: 'Add strong password encryption to your PDF files online. Protect sensitive documents against unauthorized access.',
    howTo: [
      'Upload the PDF you want to password protect.',
      'Enter and confirm your chosen password.',
      'Select supported permissions (e.g., allow printing or text copying).',
      'Click Protect PDF and download your secure encrypted document.'
    ],
    faqs: [
      { q: 'Are passwords stored on the server?', a: 'Never. Passwords are never logged, stored, or retained anywhere.' },
      { q: 'Can anyone open the file without the password?', a: 'No, standard PDF readers will prompt for the password before allowing access.' }
    ],
    relatedTools: ['unlock-pdf', 'compress-pdf', 'add-watermark']
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'security',
    shortDescription: 'Remove password restrictions when you supply the authorized password.',
    description: 'Permanently remove password encryption and editing restrictions from PDFs when you know the password, saving you from entering it every time.',
    popular: true,
    icon: 'Unlock',
    accept: '.pdf,application/pdf',
    multiple: false,
    endpoint: '/api/unlock',
    metaTitle: 'Unlock PDF - Remove PDF Password & Restrictions | OpenPDF',
    metaDescription: 'Remove password protection from PDF documents when authorized. Download an unencrypted copy of your PDF.',
    howTo: [
      'Upload your password-protected PDF.',
      'Enter the document password.',
      'Click Unlock PDF to remove encryption.',
      'Download your unlocked PDF file.'
    ],
    faqs: [
      { q: 'Does OpenPDF brute-force unknown passwords?', a: 'No, OpenPDF respects security ethics and requires you to provide the valid password to unlock the document.' }
    ],
    relatedTools: ['protect-pdf', 'organize-pdf', 'merge-pdf']
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}

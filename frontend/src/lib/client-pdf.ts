import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

export async function clientMergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function clientSplitPdf(
  file: File,
  mode: string,
  ranges: string,
  everyN: number = 1
): Promise<{ filename: string; data: Uint8Array }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = srcDoc.getPageCount();
  const results: { filename: string; data: Uint8Array }[] = [];
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copied);
      const data = await newDoc.save();
      results.push({ filename: `${baseName}_page_${i + 1}.pdf`, data });
    }
  } else if (mode === 'ranges' && ranges.trim()) {
    const rangeParts = ranges.split(',');
    for (let idx = 0; idx < rangeParts.length; idx++) {
      const part = rangeParts[idx].trim();
      if (!part) continue;
      const pageIndices: number[] = [];
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = Math.max(1, Math.min(totalPages, parseInt(startStr)));
        const end = Math.max(1, Math.min(totalPages, parseInt(endStr)));
        for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
          pageIndices.push(p - 1);
        }
      } else {
        const p = Math.max(1, Math.min(totalPages, parseInt(part)));
        pageIndices.push(p - 1);
      }

      if (pageIndices.length > 0) {
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, pageIndices);
        copied.forEach((cp) => newDoc.addPage(cp));
        const data = await newDoc.save();
        results.push({ filename: `${baseName}_part_${idx + 1}.pdf`, data });
      }
    }
  } else if (mode === 'every_n') {
    const step = Math.max(1, everyN);
    let part = 1;
    for (let i = 0; i < totalPages; i += step) {
      const indices: number[] = [];
      for (let j = i; j < Math.min(i + step, totalPages); j++) {
        indices.push(j);
      }
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((cp) => newDoc.addPage(cp));
      const data = await newDoc.save();
      results.push({ filename: `${baseName}_part_${part}.pdf`, data });
      part++;
    }
  }

  return results;
}

export async function clientRotatePdf(
  file: File,
  angle: number,
  pages?: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer);
  const total = doc.getPageCount();
  const targetSet = pages && pages.length > 0 ? new Set(pages) : null;

  for (let i = 1; i <= total; i++) {
    if (!targetSet || targetSet.has(i)) {
      const page = doc.getPage(i - 1);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    }
  }

  return await doc.save();
}

export async function clientDeletePages(
  file: File,
  pagesToDelete: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer);
  const total = doc.getPageCount();
  const deleteSet = new Set(pagesToDelete);

  const keepIndices: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (!deleteSet.has(i)) {
      keepIndices.push(i - 1);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages from the document.');
  }

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(doc, keepIndices);
  copied.forEach((p) => newDoc.addPage(p));

  return await newDoc.save();
}

export async function clientExtractPages(
  file: File,
  pagesToExtract: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer);
  const total = doc.getPageCount();
  const validIndices = pagesToExtract
    .filter((p) => p >= 1 && p <= total)
    .map((p) => p - 1);

  if (validIndices.length === 0) {
    throw new Error('No valid pages selected for extraction.');
  }

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(doc, validIndices);
  copied.forEach((p) => newDoc.addPage(p));

  return await newDoc.save();
}

export async function clientReorderPages(
  file: File,
  newOrder: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer);
  const total = doc.getPageCount();
  const indices = newOrder.filter((p) => p >= 1 && p <= total).map((p) => p - 1);

  if (indices.length === 0) {
    throw new Error('Invalid page order provided.');
  }

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(doc, indices);
  copied.forEach((p) => newDoc.addPage(p));

  return await newDoc.save();
}

export async function clientImagesToPdf(
  files: File[],
  orientation: string = 'auto',
  margin: number = 0
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    let embeddedImg;
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (isPng) {
      embeddedImg = await pdfDoc.embedPng(bytes);
    } else {
      embeddedImg = await pdfDoc.embedJpg(bytes);
    }

    const { width: imgW, height: imgH } = embeddedImg;
    let pageW = 595.0;
    let pageH = 842.0;

    if (orientation === 'landscape') {
      pageW = 842.0;
      pageH = 595.0;
    } else if (orientation === 'auto') {
      if (imgW > imgH) {
        pageW = 842.0;
        pageH = 595.0;
      }
    }

    const page = pdfDoc.addPage([pageW, pageH]);
    const availW = pageW - 2 * margin;
    const availH = pageH - 2 * margin;
    const scale = Math.min(availW / imgW, availH / imgH);
    const scaledW = imgW * scale;
    const scaledH = imgH * scale;
    const x = margin + (availW - scaledW) / 2;
    const y = margin + (availH - scaledH) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: scaledW,
      height: scaledH,
    });
  }

  return await pdfDoc.save();
}

export async function clientAddPageNumbers(
  file: File,
  position: string = 'bottom-center',
  startNumber: number = 1,
  formatStr: string = 'Page {n} of {total}',
  fontSize: number = 11,
  excludeCover: boolean = false
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuffer);
  const total = doc.getPageCount();
  const effectiveTotal = excludeCover ? total - 1 : total;
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < total; i++) {
    if (excludeCover && i === 0) continue;
    const page = doc.getPage(i);
    const currentNum = startNumber + (excludeCover ? i - 1 : i);
    const text = formatStr
      .replace('{n}', currentNum.toString())
      .replace('{total}', effectiveTotal.toString());
    const { width: pageW, height: pageH } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const margin = 36;

    let x = (pageW - textWidth) / 2;
    if (position.includes('left')) x = margin;
    else if (position.includes('right')) x = pageW - margin - textWidth;

    let y = margin;
    if (position.includes('top')) y = pageH - margin;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return await doc.save();
}

export async function clientZipFiles(
  files: { filename: string; data: Uint8Array }[]
): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.filename, f.data));
  return await zip.generateAsync({ type: 'blob' });
}

'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/types/tool';
import { FileUploadArea } from '@/components/upload/FileUploadArea';
import { ToolOptions, ToolOptionValues } from '@/components/tools/ToolOptions';
import { ResultScreen } from '@/components/results/ResultScreen';
import { callBackendApi } from '@/lib/api';
import {
  clientMergePdfs,
  clientSplitPdf,
  clientRotatePdf,
  clientImagesToPdf,
  clientAddPageNumbers,
  clientZipFiles,
} from '@/lib/client-pdf';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<ToolOptionValues>({
    splitMode: 'all',
    splitEveryN: 1,
    rotateAngle: 90,
    compressMode: 'recommended',
    emailTargetMb: 2,
    excelFormat: 'xlsx',
    imageDpi: 150,
    imageOrientation: 'auto',
    imageMargin: 0,
    pageNumberPosition: 'bottom-center',
    pageNumberStart: 1,
    pageNumberFormat: 'Page {n} of {total}',
    pageNumberExcludeCover: false,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.3,
    watermarkRotation: 45,
    addTextContent: 'Approved',
    addTextPage: 1,
    addTextX: 72,
    addTextY: 72,
    protectAllowPrint: true,
    protectAllowCopy: true,
  });

  const [processingState, setProcessingState] = useState<
    'idle' | 'processing' | 'completed' | 'failed'
  >('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    blob: Blob;
    filename: string;
    size: number;
    savingsPct?: number;
  } | null>(null);

  const handleOptionsChange = (updated: Partial<ToolOptionValues>) => {
    setOptions((prev) => ({ ...prev, ...updated }));
  };

  const handleReorderFiles = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedFiles.length) return;
    const reordered = [...selectedFiles];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setSelectedFiles(reordered);
  };

  const handleStartAgain = () => {
    setSelectedFiles([]);
    setProcessingState('idle');
    setErrorMsg(null);
    setResultData(null);
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    setProcessingState('processing');
    setErrorMsg(null);

    try {
      // 1. Check for client-side processing where practical and applicable
      if (tool.id === 'merge-pdf' && selectedFiles.length >= 2) {
        try {
          const mergedBytes = await clientMergePdfs(selectedFiles);
          const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
          setResultData({
            blob,
            filename: 'merged_document.pdf',
            size: blob.size,
          });
          setProcessingState('completed');
          return;
        } catch {
          // Fall through to server API if browser processing hit complex PDF stream
        }
      }

      if (tool.id === 'split-pdf' && selectedFiles.length === 1) {
        try {
          const parts = await clientSplitPdf(
            selectedFiles[0],
            options.splitMode || 'all',
            options.splitRanges || '',
            options.splitEveryN || 1
          );
          if (parts.length === 1) {
            const blob = new Blob([parts[0].data as unknown as BlobPart], { type: 'application/pdf' });
            setResultData({
              blob,
              filename: parts[0].filename,
              size: blob.size,
            });
            setProcessingState('completed');
            return;
          } else if (parts.length > 1) {
            const zipBlob = await clientZipFiles(parts);
            setResultData({
              blob: zipBlob,
              filename: `${selectedFiles[0].name.replace('.pdf', '')}_split.zip`,
              size: zipBlob.size,
            });
            setProcessingState('completed');
            return;
          }
        } catch {
          // Fall through to server API
        }
      }

      if (tool.id === 'rotate-pdf' && selectedFiles.length === 1) {
        try {
          const rotated = await clientRotatePdf(
            selectedFiles[0],
            options.rotateAngle || 90
          );
          const blob = new Blob([rotated as unknown as BlobPart], { type: 'application/pdf' });
          setResultData({
            blob,
            filename: `rotated_${selectedFiles[0].name}`,
            size: blob.size,
          });
          setProcessingState('completed');
          return;
        } catch {
          // Fall through
        }
      }

      if (
        (tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') &&
        selectedFiles.length > 0
      ) {
        try {
          const pdfBytes = await clientImagesToPdf(
            selectedFiles,
            options.imageOrientation || 'auto',
            options.imageMargin || 0
          );
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          setResultData({
            blob,
            filename: 'images_combined.pdf',
            size: blob.size,
          });
          setProcessingState('completed');
          return;
        } catch {
          // Fall through to server API
        }
      }

      if (tool.id === 'add-page-numbers' && selectedFiles.length === 1) {
        try {
          const numbered = await clientAddPageNumbers(
            selectedFiles[0],
            options.pageNumberPosition || 'bottom-center',
            options.pageNumberStart || 1,
            options.pageNumberFormat || 'Page {n} of {total}',
            11,
            options.pageNumberExcludeCover || false
          );
          const blob = new Blob([numbered as unknown as BlobPart], { type: 'application/pdf' });
          setResultData({
            blob,
            filename: `numbered_${selectedFiles[0].name}`,
            size: blob.size,
          });
          setProcessingState('completed');
          return;
        } catch {
          // Fall through
        }
      }

      // 2. Server-side API Processing
      const formData = new FormData();

      if (tool.multiple) {
        selectedFiles.forEach((file) => formData.append('files', file));
      } else {
        formData.append('file', selectedFiles[0]);
      }

      // Append tool-specific options
      if (tool.id === 'split-pdf') {
        formData.append('mode', options.splitMode || 'all');
        formData.append('ranges', options.splitRanges || '');
        formData.append('every_n', (options.splitEveryN || 1).toString());
      } else if (tool.id === 'extract-pdf-pages') {
        formData.append('pages', options.extractPages || '1');
      } else if (tool.id === 'delete-pdf-pages') {
        formData.append('pages', options.deletePages || '1');
      } else if (tool.id === 'rotate-pdf') {
        formData.append('angle', (options.rotateAngle || 90).toString());
      } else if (tool.id === 'reorder-pdf-pages') {
        formData.append('order', options.reorderPages || '1');
      } else if (tool.id === 'compress-pdf') {
        formData.append('mode', options.compressMode || 'recommended');
      } else if (tool.id === 'compress-pdf-for-email') {
        formData.append('target_mb', (options.emailTargetMb || 2).toString());
      } else if (tool.id === 'pdf-to-excel') {
        formData.append('export_format', options.excelFormat || 'xlsx');
      } else if (tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png') {
        formData.append('dpi', (options.imageDpi || 150).toString());
      } else if (tool.id === 'add-page-numbers') {
        formData.append('position', options.pageNumberPosition || 'bottom-center');
        formData.append('start_number', (options.pageNumberStart || 1).toString());
        formData.append('format_str', options.pageNumberFormat || 'Page {n} of {total}');
        formData.append('exclude_cover', (options.pageNumberExcludeCover || false).toString());
      } else if (tool.id === 'add-watermark') {
        formData.append('watermark_text', options.watermarkText || 'CONFIDENTIAL');
        formData.append('opacity', (options.watermarkOpacity ?? 0.3).toString());
        formData.append('rotation', (options.watermarkRotation ?? 45).toString());
      } else if (tool.id === 'add-text-to-pdf') {
        formData.append('text', options.addTextContent || 'Approved');
        formData.append('page_number', (options.addTextPage || 1).toString());
        formData.append('x', (options.addTextX || 72).toString());
        formData.append('y', (options.addTextY || 72).toString());
      } else if (tool.id === 'crop-pdf') {
        formData.append('top_margin', (options.cropTop || 0).toString());
        formData.append('bottom_margin', (options.cropBottom || 0).toString());
        formData.append('left_margin', (options.cropLeft || 0).toString());
        formData.append('right_margin', (options.cropRight || 0).toString());
      } else if (tool.id === 'protect-pdf') {
        if (!options.protectPassword) {
          throw new Error('Please enter a password.');
        }
        if (options.protectPassword !== options.protectPasswordConfirm) {
          throw new Error('Passwords do not match. Please re-enter.');
        }
        formData.append('password', options.protectPassword);
        formData.append('allow_printing', (options.protectAllowPrint ?? true).toString());
        formData.append('allow_copying', (options.protectAllowCopy ?? true).toString());
      } else if (tool.id === 'unlock-pdf') {
        if (!options.unlockPassword) {
          throw new Error('Please enter the document password.');
        }
        formData.append('password', options.unlockPassword);
      }

      // Handle PDF Size Analyzer (returns JSON response)
      if (tool.id === 'pdf-size-analyzer') {
        const response = await fetch(`http://localhost:8000${tool.endpoint}`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Failed to analyze PDF size.');
        }
        const data = await response.json();
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        setResultData({
          blob: jsonBlob,
          filename: 'pdf_analysis_report.json',
          size: jsonBlob.size,
        });
        setProcessingState('completed');
        return;
      }

      const res = await callBackendApi(tool.endpoint, formData);

      // Extract savings percentage header if returned by compress
      let savingsPct: number | undefined;
      if (res.headers['x-savings-percent']) {
        savingsPct = parseFloat(res.headers['x-savings-percent']);
      }

      setResultData({
        blob: res.blob,
        filename: res.filename,
        size: res.size,
        savingsPct,
      });
      setProcessingState('completed');
    } catch (err: unknown) {
      setProcessingState('failed');
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {processingState === 'completed' && resultData ? (
        <ResultScreen
          filename={resultData.filename}
          size={resultData.size}
          blob={resultData.blob}
          savingsPct={resultData.savingsPct}
          relatedToolSlugs={tool.relatedTools}
          onStartAgain={handleStartAgain}
        />
      ) : (
        <div className="space-y-6">
          {/* File Upload Component */}
          <FileUploadArea
            accept={tool.accept}
            multiple={tool.multiple}
            selectedFiles={selectedFiles}
            onFilesSelected={setSelectedFiles}
            onRemoveFile={(idx) =>
              setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
            }
            onReorderFiles={tool.multiple ? handleReorderFiles : undefined}
            onClearAll={handleStartAgain}
          />

          {/* Tool Options */}
          {selectedFiles.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
              <ToolOptions
                tool={tool}
                options={options}
                onChange={handleOptionsChange}
              />

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Process Button */}
              <button
                type="button"
                disabled={processingState === 'processing'}
                onClick={handleProcess}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                {processingState === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing {tool.name}...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed & {tool.name}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

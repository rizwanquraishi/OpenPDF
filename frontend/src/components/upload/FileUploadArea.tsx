'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/api';

interface FileUploadAreaProps {
  accept: string;
  multiple: boolean;
  selectedFiles: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onReorderFiles?: (fromIndex: number, toIndex: number) => void;
  onClearAll: () => void;
  maxSizeMb?: number;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  accept,
  multiple,
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
  onReorderFiles,
  onClearAll,
  maxSizeMb = 50,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setErrorMsg(null);

    const newFiles: File[] = [];
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (file.size > maxSizeBytes) {
        setErrorMsg(`File "${file.name}" exceeds the maximum allowed size of ${maxSizeMb} MB.`);
        continue;
      }
      newFiles.push(file);
      if (!multiple) break; // only take 1 if not multiple
    }

    if (newFiles.length > 0) {
      if (multiple) {
        onFilesSelected([...selectedFiles, ...newFiles]);
      } else {
        onFilesSelected(newFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      {/* Upload Drop Zone */}
      {selectedFiles.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/50 scale-[1.01]'
              : 'border-gray-300 hover:border-brand-400 bg-gray-50/60 hover:bg-brand-50/20'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => validateAndAddFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Choose {multiple ? 'files' : 'file'} or drag & drop here
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Supported formats: {accept.replace(/\./g, ' ').toUpperCase()}. Max file size {maxSizeMb}MB.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:bg-brand-600 hover:shadow-lg transition-all"
          >
            Select {multiple ? 'Files' : 'File'}
          </button>
        </div>
      ) : (
        /* Selected Files View */
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                Selected {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}
              </span>
              <span className="text-xs text-gray-400">
                (Total: {formatFileSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {multiple && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline px-2 py-1"
                >
                  + Add More
                </button>
              )}
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1"
              >
                Clear All
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => validateAndAddFiles(e.target.files)}
            className="hidden"
          />

          <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {selectedFiles.map((file, idx) => (
              <li
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200/60 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px] sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {onReorderFiles && selectedFiles.length > 1 && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderFiles(idx, idx - 1)}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === selectedFiles.length - 1}
                        onClick={() => onReorderFiles(idx, idx + 1)}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Error Message */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

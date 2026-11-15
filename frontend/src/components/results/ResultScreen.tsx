'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatFileSize, triggerDownload } from '@/lib/api';
import { getToolBySlug } from '@/lib/tools';
import { ToolIcon } from '@/components/common/ToolIcon';

interface ResultScreenProps {
  filename: string;
  size: number;
  blob: Blob;
  savingsPct?: number;
  relatedToolSlugs: string[];
  onStartAgain: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  filename,
  size,
  blob,
  savingsPct,
  relatedToolSlugs,
  onStartAgain,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E5322D', '#3B82F6', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleDownload = () => {
    triggerDownload(blob, filename);
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center py-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        Processing Complete!
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Your document has been processed and is ready for download.
      </p>

      {/* File Card */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 mb-6 text-left">
        <div className="flex items-center justify-between">
          <div className="truncate mr-4">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Output File</p>
            <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{filename}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Size</p>
            <p className="text-sm font-bold text-brand-600 mt-0.5">{formatFileSize(size)}</p>
          </div>
        </div>

        {savingsPct !== undefined && savingsPct > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-green-700 font-semibold bg-green-50/80 -mx-2 -mb-2 p-2.5 rounded-xl">
            <span>File size reduced by:</span>
            <span className="text-sm font-extrabold">{savingsPct}%</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Document</span>
        </button>

        <button
          onClick={onStartAgain}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Related Tools */}
      {relatedToolSlugs && relatedToolSlugs.length > 0 && (
        <div className="pt-8 border-t border-gray-200 text-left">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">
            You might also need these tools:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedToolSlugs.slice(0, 4).map((slug) => {
              const rel = getToolBySlug(slug);
              if (!rel) return null;
              return (
                <Link
                  key={rel.id}
                  href={`/${rel.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200/80 hover:border-brand-500 hover:shadow-sm transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ToolIcon name={rel.icon} className="w-4 h-4" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-brand-500 transition-colors">
                      {rel.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{rel.shortDescription}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

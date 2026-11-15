'use client';

import React from 'react';
import { ToolDefinition } from '@/types/tool';
import { Sliders } from 'lucide-react';

export interface ToolOptionValues {
  splitMode?: string;
  splitRanges?: string;
  splitEveryN?: number;
  extractPages?: string;
  deletePages?: string;
  rotateAngle?: number;
  rotatePages?: string;
  reorderPages?: string;
  compressMode?: string;
  removeMetadata?: boolean;
  emailTargetMb?: number;
  excelFormat?: string;
  imageDpi?: number;
  imageOrientation?: string;
  imageMargin?: number;
  pageNumberPosition?: string;
  pageNumberStart?: number;
  pageNumberFormat?: string;
  pageNumberExcludeCover?: boolean;
  watermarkText?: string;
  watermarkOpacity?: number;
  watermarkRotation?: number;
  addTextContent?: string;
  addTextPage?: number;
  addTextX?: number;
  addTextY?: number;
  addTextSize?: number;
  cropTop?: number;
  cropBottom?: number;
  cropLeft?: number;
  cropRight?: number;
  protectPassword?: string;
  protectPasswordConfirm?: string;
  protectAllowPrint?: boolean;
  protectAllowCopy?: boolean;
  unlockPassword?: string;
}

interface ToolOptionsProps {
  tool: ToolDefinition;
  options: ToolOptionValues;
  onChange: (updated: Partial<ToolOptionValues>) => void;
}

export const ToolOptions: React.FC<ToolOptionsProps> = ({ tool, options, onChange }) => {
  return (
    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/80 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 text-gray-800 font-semibold text-sm">
        <Sliders className="w-4 h-4 text-brand-500" />
        <span>Tool Settings & Options</span>
      </div>

      {/* 01. Merge PDF */}
      {tool.id === 'merge-pdf' && (
        <p className="text-xs text-gray-500">
          PDF documents will be combined in the exact order shown above. Use the arrows to reorder before merging.
        </p>
      )}

      {/* 02. Split PDF */}
      {tool.id === 'split-pdf' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700">Split Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'Extract Every Page' },
              { id: 'ranges', label: 'Custom Ranges' },
              { id: 'every_n', label: 'Every N Pages' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ splitMode: m.id })}
                className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                  (options.splitMode || 'all') === m.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {options.splitMode === 'ranges' && (
            <div className="pt-2">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Page Ranges (comma separated, e.g. 1-3, 4-5)
              </label>
              <input
                type="text"
                placeholder="1-2, 3-5"
                value={options.splitRanges || ''}
                onChange={(e) => onChange({ splitRanges: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          )}

          {options.splitMode === 'every_n' && (
            <div className="pt-2">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Split Every N Pages
              </label>
              <input
                type="number"
                min={1}
                value={options.splitEveryN || 1}
                onChange={(e) => onChange({ splitEveryN: parseInt(e.target.value) || 1 })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          )}
        </div>
      )}

      {/* 04. Extract Pages */}
      {tool.id === 'extract-pdf-pages' && (
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Pages to Extract (e.g. 1, 3, 5-8)
          </label>
          <input
            type="text"
            placeholder="1, 3, 5"
            value={options.extractPages || ''}
            onChange={(e) => onChange({ extractPages: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      )}

      {/* 05. Delete Pages */}
      {tool.id === 'delete-pdf-pages' && (
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Pages to Delete (e.g. 2, 4)
          </label>
          <input
            type="text"
            placeholder="2, 4"
            value={options.deletePages || ''}
            onChange={(e) => onChange({ deletePages: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      )}

      {/* 06. Rotate PDF */}
      {tool.id === 'rotate-pdf' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700">Rotation Angle</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { angle: 90, label: '90° Clockwise' },
              { angle: 180, label: '180° Upside Down' },
              { angle: 270, label: '90° Counter-CW' },
            ].map((r) => (
              <button
                key={r.angle}
                type="button"
                onClick={() => onChange({ rotateAngle: r.angle })}
                className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                  (options.rotateAngle || 90) === r.angle
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 07. Reorder Pages */}
      {tool.id === 'reorder-pdf-pages' && (
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            New Page Sequence (e.g. 3, 1, 2)
          </label>
          <input
            type="text"
            placeholder="3, 1, 2"
            value={options.reorderPages || ''}
            onChange={(e) => onChange({ reorderPages: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      )}

      {/* 09. Compress PDF */}
      {tool.id === 'compress-pdf' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700">Compression Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'low', name: 'Low Compression', desc: 'High quality, less size reduction' },
              { id: 'recommended', name: 'Recommended', desc: 'Great quality, good compression' },
              { id: 'extreme', name: 'Extreme', desc: 'Maximum compression, lower quality' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ compressMode: m.id })}
                className={`p-3 text-left rounded-xl border transition-all ${
                  (options.compressMode || 'recommended') === m.id
                    ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-gray-200 bg-white hover:bg-gray-100'
                }`}
              >
                <p className="text-xs font-bold text-gray-800">{m.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 11. Compress PDF for Email */}
      {tool.id === 'compress-pdf-for-email' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700">Target Maximum Size</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 5, 10].map((mb) => (
              <button
                key={mb}
                type="button"
                onClick={() => onChange({ emailTargetMb: mb })}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                  (options.emailTargetMb || 2) === mb
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {mb} MB
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 14. PDF to Excel */}
      {tool.id === 'pdf-to-excel' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Export Format</label>
          <div className="flex gap-3">
            {[
              { id: 'xlsx', label: 'Excel Workbook (.xlsx)' },
              { id: 'csv', label: 'CSV File (.csv)' },
            ].map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="excelFormat"
                  value={f.id}
                  checked={(options.excelFormat || 'xlsx') === f.id}
                  onChange={() => onChange({ excelFormat: f.id })}
                  className="text-brand-500 focus:ring-brand-500"
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 16 & 17. PDF to JPG/PNG */}
      {(tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png') && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Image Resolution</label>
          <div className="flex gap-3">
            {[
              { dpi: 150, label: 'Standard (150 DPI)' },
              { dpi: 300, label: 'High Resolution (300 DPI)' },
            ].map((d) => (
              <label key={d.dpi} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="dpi"
                  value={d.dpi}
                  checked={(options.imageDpi || 150) === d.dpi}
                  onChange={() => onChange({ imageDpi: d.dpi })}
                  className="text-brand-500 focus:ring-brand-500"
                />
                <span>{d.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 19 & 20. JPG/PNG to PDF */}
      {(tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Orientation</label>
            <select
              value={options.imageOrientation || 'auto'}
              onChange={(e) => onChange({ imageOrientation: e.target.value })}
              className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
            >
              <option value="auto">Auto (Match Image)</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Margin</label>
            <select
              value={options.imageMargin || 0}
              onChange={(e) => onChange({ imageMargin: parseInt(e.target.value) })}
              className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
            >
              <option value={0}>No Margin</option>
              <option value={20}>Small Margin (20pt)</option>
              <option value={40}>Big Margin (40pt)</option>
            </select>
          </div>
        </div>
      )}

      {/* 24. Add Page Numbers */}
      {tool.id === 'add-page-numbers' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Position</label>
              <select
                value={options.pageNumberPosition || 'bottom-center'}
                onChange={(e) => onChange({ pageNumberPosition: e.target.value })}
                className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Starting Number</label>
              <input
                type="number"
                min={1}
                value={options.pageNumberStart || 1}
                onChange={(e) => onChange({ pageNumberStart: parseInt(e.target.value) || 1 })}
                className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeCover"
              checked={options.pageNumberExcludeCover || false}
              onChange={(e) => onChange({ pageNumberExcludeCover: e.target.checked })}
              className="rounded text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="excludeCover" className="text-xs text-gray-700 cursor-pointer">
              Exclude Cover Page (Do not number first page)
            </label>
          </div>
        </div>
      )}

      {/* 25. Add Watermark */}
      {tool.id === 'add-watermark' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Watermark Text</label>
            <input
              type="text"
              placeholder="CONFIDENTIAL"
              value={options.watermarkText || ''}
              onChange={(e) => onChange({ watermarkText: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Opacity ({Math.round((options.watermarkOpacity ?? 0.3) * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={options.watermarkOpacity ?? 0.3}
                onChange={(e) => onChange({ watermarkOpacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Rotation</label>
              <select
                value={options.watermarkRotation ?? 45}
                onChange={(e) => onChange({ watermarkRotation: parseInt(e.target.value) })}
                className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value={45}>45° Diagonal</option>
                <option value={0}>0° Horizontal</option>
                <option value={90}>90° Vertical</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 26. Add Text */}
      {tool.id === 'add-text-to-pdf' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Text to Insert</label>
            <input
              type="text"
              placeholder="Approved & Verified"
              value={options.addTextContent || ''}
              onChange={(e) => onChange({ addTextContent: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-gray-600 block mb-0.5">Page #</label>
              <input
                type="number"
                min={1}
                value={options.addTextPage || 1}
                onChange={(e) => onChange({ addTextPage: parseInt(e.target.value) || 1 })}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-600 block mb-0.5">X Position</label>
              <input
                type="number"
                value={options.addTextX ?? 72}
                onChange={(e) => onChange({ addTextX: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-600 block mb-0.5">Y Position</label>
              <input
                type="number"
                value={options.addTextY ?? 72}
                onChange={(e) => onChange({ addTextY: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 28. Crop PDF */}
      {tool.id === 'crop-pdf' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 block">Margins to Trim (pt)</label>
          <div className="grid grid-cols-4 gap-2">
            {['Top', 'Bottom', 'Left', 'Right'].map((side) => {
              const key = `crop${side}` as keyof ToolOptionValues;
              return (
                <div key={side}>
                  <label className="text-[10px] text-gray-500 block mb-0.5">{side}</label>
                  <input
                    type="number"
                    min={0}
                    value={(options[key] as number) || 0}
                    onChange={(e) => onChange({ [key]: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white text-center"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 29. Protect PDF */}
      {tool.id === 'protect-pdf' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Set Password</label>
            <input
              type="password"
              placeholder="Enter strong password"
              value={options.protectPassword || ''}
              onChange={(e) => onChange({ protectPassword: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={options.protectPasswordConfirm || ''}
              onChange={(e) => onChange({ protectPasswordConfirm: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
            />
          </div>
          <div className="pt-1 space-y-1.5">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={options.protectAllowPrint ?? true}
                onChange={(e) => onChange({ protectAllowPrint: e.target.checked })}
                className="rounded text-brand-500"
              />
              <span>Allow Printing</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={options.protectAllowCopy ?? true}
                onChange={(e) => onChange({ protectAllowCopy: e.target.checked })}
                className="rounded text-brand-500"
              />
              <span>Allow Text & Graphic Copying</span>
            </label>
          </div>
        </div>
      )}

      {/* 30. Unlock PDF */}
      {tool.id === 'unlock-pdf' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 block">Existing Document Password</label>
          <input
            type="password"
            placeholder="Enter password to unlock"
            value={options.unlockPassword || ''}
            onChange={(e) => onChange({ unlockPassword: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white"
          />
          <p className="text-[11px] text-gray-400">
            You must enter the valid password authorized for this file. OpenPDF will decrypt the document.
          </p>
        </div>
      )}
    </div>
  );
};

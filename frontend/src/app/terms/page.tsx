import React from 'react';
import { FileCheck2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - OpenPDF Free Document Utilities',
  description: 'Terms and conditions governing the use of the OpenPDF all-in-one PDF tools platform.',
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">Effective Date: November 2026</p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <p className="text-xs leading-relaxed">
            By accessing or using the OpenPDF website and utilities, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>

          <h2 className="text-base font-bold text-gray-900">1. Nature of the Service</h2>
          <p className="text-xs leading-relaxed">
            OpenPDF provides 30 functional document conversion, editing, optimization, and security tools free of charge. No payment or registration is required to use any published tool.
          </p>

          <h2 className="text-base font-bold text-gray-900">2. Permissible Use</h2>
          <p className="text-xs leading-relaxed">
            You agree to use OpenPDF solely for lawful purposes. You must not upload any document containing malware, illegal material, or documents for which you do not have appropriate legal authorization to process.
          </p>

          <h2 className="text-base font-bold text-gray-900">3. Disclaimer of Warranty</h2>
          <p className="text-xs leading-relaxed">
            OpenPDF is provided &quot;as is&quot; without warranties of any kind. While we strive for maximum fidelity in conversions and compression algorithms, complex PDF structures, non-standard fonts, or specialized vector formats may yield minor visual discrepancies during office format reconstruction.
          </p>

          <h2 className="text-base font-bold text-gray-900">4. Limitation of Liability</h2>
          <p className="text-xs leading-relaxed">
            In no event shall OpenPDF or its contributors be held liable for any damages arising out of the use or inability to use the tools, including data loss or formatting variations. Users are encouraged to retain original copies of their files.
          </p>
        </div>
      </div>
    </div>
  );
}

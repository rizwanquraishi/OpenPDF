import React from 'react';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - OpenPDF Secure Document Processing',
  description: 'Understand how OpenPDF protects your documents with browser-based processing, automatic 30-minute file deletion, and zero permanent storage.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Privacy Policy & Data Protection Pledge
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: November 2026 • Effective immediately
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80">
            <h2 className="text-base font-bold text-gray-900 mb-2">Executive Summary</h2>
            <p className="text-xs leading-relaxed text-gray-600">
              OpenPDF does not sell, read, inspect, or permanently store your files.
              Files processed in the browser never leave your device. Files processed on our servers
              are stored in isolated job directories and automatically deleted within 30 minutes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Client-Side vs Server-Side Processing</h2>
            <p className="text-xs leading-relaxed">
              OpenPDF utilizes a hybrid processing architecture:
            </p>
            <ul className="text-xs list-disc pl-5 space-y-1.5 text-gray-600">
              <li>
                <strong>Browser-Side Processing:</strong> Operations including Merge PDF, Split PDF, Rotate PDF, Delete Pages, Extract Pages, and Image to PDF can run directly on your device via WebAssembly and JavaScript. In these workflows, document bytes never leave your browser.
              </li>
              <li>
                <strong>Server-Side Processing:</strong> Operations requiring heavy computational engines (such as Ghostscript optimization, LibreOffice conversions for Word/Excel/PowerPoint, and complex text parsing) transmit files via SSL/TLS encryption to our processing server.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Automatic 30-Minute File Deletion</h2>
            <p className="text-xs leading-relaxed">
              When documents are uploaded to our servers, they are assigned a random UUID identifier and placed in a dedicated, isolated sandbox directory. Our background cleanup daemon continuously purges all job directories older than 30 minutes. No manual intervention is needed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Password Security and Non-Logging</h2>
            <p className="text-xs leading-relaxed">
              When using the <strong>Protect PDF</strong> or <strong>Unlock PDF</strong> utilities, passwords entered in form fields are processed purely in ephemeral memory. Passwords are never written to server logs, never stored in databases, and never retained once the encryption/decryption response is generated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Third-Party Storage & Analytics</h2>
            <p className="text-xs leading-relaxed">
              OpenPDF does not send your documents or metadata to any third-party AI model, advertising exchange, or external cloud storage provider (like AWS S3 or Google Cloud Storage). All processing occurs within isolated environments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

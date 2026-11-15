import React from 'react';
import Link from 'next/link';
import { FileText, Shield, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Open<span className="text-brand-500">PDF</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              OpenPDF is the modern, fast, secure, and completely free online PDF platform.
              All 30 tools are 100% free with no registration, no subscriptions, and automated file cleanup.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                Zero File Retention
              </span>
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          {/* Col 1: Popular Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/merge-pdf" className="hover:text-white transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="hover:text-white transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-white transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-word" className="hover:text-white transition-colors">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-white transition-colors">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/protect-pdf" className="hover:text-white transition-colors">
                  Protect PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools?category=organize" className="hover:text-white transition-colors">
                  Organize PDF
                </Link>
              </li>
              <li>
                <Link href="/tools?category=optimize" className="hover:text-white transition-colors">
                  Optimize & Compress
                </Link>
              </li>
              <li>
                <Link href="/tools?category=convert" className="hover:text-white transition-colors">
                  Convert PDF
                </Link>
              </li>
              <li>
                <Link href="/tools?category=edit" className="hover:text-white transition-colors">
                  Edit PDF
                </Link>
              </li>
              <li>
                <Link href="/tools?category=security" className="hover:text-white transition-colors">
                  PDF Security
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-brand-400 hover:text-brand-300 font-medium">
                  View All 30 Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Trust */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About OpenPDF
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} OpenPDF. All rights reserved. Free PDF utilities for everyone.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Built with precision & high standards</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

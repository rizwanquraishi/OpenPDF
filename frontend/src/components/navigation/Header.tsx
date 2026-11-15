'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, FileText, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand-500 transition-colors">
                Open<span className="text-brand-500">PDF</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide -mt-1">
                100% FREE PDF TOOLS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-gray-700">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              All PDF Tools
            </Link>
            <Link
              href="/merge-pdf"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              Split PDF
            </Link>
            <Link
              href="/compress-pdf"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              Compress PDF
            </Link>

            {/* Convert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setConvertDropdownOpen(!convertDropdownOpen)}
                onMouseEnter={() => setConvertDropdownOpen(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
              >
                <span>Convert PDF</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {convertDropdownOpen && (
                <div
                  onMouseLeave={() => setConvertDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <Link
                    href="/pdf-to-word"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    PDF to Word (.docx)
                  </Link>
                  <Link
                    href="/pdf-to-excel"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    PDF to Excel (.xlsx)
                  </Link>
                  <Link
                    href="/pdf-to-powerpoint"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    PDF to PowerPoint (.pptx)
                  </Link>
                  <Link
                    href="/pdf-to-jpg"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    PDF to JPG Images
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    href="/word-to-pdf"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    Word to PDF
                  </Link>
                  <Link
                    href="/jpg-to-pdf"
                    onClick={() => setConvertDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  >
                    JPG to PDF
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg hover:text-brand-500 hover:bg-brand-50 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm hover:shadow"
            >
              Explore 30 Tools
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in fade-in duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Home
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            All PDF Tools (30)
          </Link>
          <Link
            href="/merge-pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Merge PDF
          </Link>
          <Link
            href="/split-pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Split PDF
          </Link>
          <Link
            href="/compress-pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Compress PDF
          </Link>
          <Link
            href="/pdf-to-word"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            PDF to Word
          </Link>
          <Link
            href="/protect-pdf"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Protect PDF
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-500"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};

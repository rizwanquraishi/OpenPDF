'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  Zap,
  Lock,
  Smartphone,
  CheckCircle,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TOOLS, CATEGORIES, getPopularTools } from '@/lib/tools';
import { ToolIcon } from '@/components/common/ToolIcon';
import { ToolCategory } from '@/types/tool';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  const popularTools = useMemo(() => getPopularTools(), []);

  // Filter tools based on search and selected category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white pt-16 pb-12 sm:pt-24 sm:pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>30 Truly Functional PDF Tools • No Limits</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Every PDF Tool You Need.{' '}
            <span className="text-brand-500">Completely Free.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Merge, split, compress, convert and edit your PDF documents with simple and
            powerful online tools. No accounts, no paywalls, zero friction.
          </p>

          {/* Primary Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-gray-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a PDF tool (e.g. merge, compress, word, protect)..."
                className="w-full py-4 pl-3 pr-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent rounded-2xl focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs font-semibold text-gray-400 hover:text-gray-700 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Most Popular Tools
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                The most frequently used utilities by millions of users daily.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View all 30 tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className="p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                    <ToolIcon name={tool.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Tools & Categories Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore All 30 Free PDF Tools
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Find the exact tool you need categorized by workflow.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Tools (30)
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-brand-600 flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <ToolIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-400 group-hover:text-brand-600 transition-colors">
                <span className="capitalize">{tool.category}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base text-gray-500">
              No PDF tools found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Why OpenPDF Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Why OpenPDF?
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Designed with strict product principles: high performance, zero tracking, and true privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">100% Free Forever</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                All 30 tools are completely accessible. No tiered subscriptions, no paywalls, and no hidden charges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No Registration</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Start processing right away. You never need an email, login, or phone number to process your documents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Automatic Deletion</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                User documents are processed securely in isolated jobs and permanently deleted within 30 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Client-Side Speed</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Common operations like merging, splitting, and rotating execute instantly directly inside your browser.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Mobile & Tablet Friendly</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Responsive interface designed for touchscreens, laptops, desktops, and mobile phones alike.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">30 Truly Working Tools</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No fake placeholders or non-functional mockups. Every single listed tool has genuine processing logic.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

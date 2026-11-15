'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Layers } from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import { ToolIcon } from '@/components/common/ToolIcon';
import { ToolCategory } from '@/types/tool';

export default function AllToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  return (
    <div className="py-12 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Complete Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            All 30 PDF Tools & Utilities
          </h1>
          <p className="text-sm text-gray-500">
            Browse our complete collection of fast, private, and free online PDF processing utilities.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder="Search tools by name or action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2.5 pl-2.5 pr-4 text-xs sm:text-sm text-gray-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-100 pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Tools (30)
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-brand-500 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <ToolIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  {tool.category}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Use Tool &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

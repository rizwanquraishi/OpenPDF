import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, BookOpen } from 'lucide-react';
import { TOOLS, getToolBySlug } from '@/lib/tools';
import { ToolWorkspace } from '@/components/tools/ToolWorkspace';
import { ToolIcon } from '@/components/common/ToolIcon';

interface ToolPageProps {
  params: {
    tool_slug: string;
  };
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    tool_slug: tool.id,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.tool_slug);
  if (!tool) {
    return {
      title: 'Tool Not Found | OpenPDF',
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: `/${tool.id}`,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `https://openpdf.dev/${tool.id}`,
      siteName: 'OpenPDF',
      type: 'website',
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.tool_slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-gray-50/50 via-white to-white min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/tools" className="hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="capitalize text-gray-700 font-medium">{tool.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-600 font-semibold">{tool.name}</span>
        </nav>

        {/* Header & Description */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <ToolIcon name={tool.icon} className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            {tool.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Core Tool Processing Workspace */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
          <ToolWorkspace tool={tool} />
        </div>

        {/* How-To Step-by-Step Instructions */}
        {tool.howTo && tool.howTo.length > 0 && (
          <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/80">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold text-gray-900">
                How to {tool.name} in 4 Easy Steps
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tool.howTo.map((step, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-xs relative"
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center mb-2">
                    {index + 1}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-gray-200/80"
                >
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

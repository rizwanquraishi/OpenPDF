import React from 'react';
import { Sparkles, CheckCircle2, FileText } from 'lucide-react';

export const metadata = {
  title: 'About OpenPDF - 100% Free Online PDF Utility Platform',
  description: 'Learn about OpenPDF vision, core product principles, and commitment to free, private PDF utilities.',
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            About OpenPDF
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            OpenPDF is an independent, high-performance, and completely free online PDF platform designed to replace restrictive, ad-bloated, and paid PDF tools.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-brand-50/60 rounded-3xl p-8 border border-brand-100 space-y-4">
          <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <span>Our Product Vision</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Empowering students, workers, and developers with truly free tools.
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every day, millions of people need to merge an agreement, compress a resume for an email, convert notes into Word, or protect a sensitive financial statement. Too often, existing websites lock users out with paid paywalls, watermark their documents, or force user accounts. OpenPDF offers exactly 30 working tools completely free of charge.
          </p>
        </div>

        {/* 10 Core Principles Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Our 10 Core Product Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'First release with exactly 30 genuinely working PDF tools.',
              'Simple and intuitive user experience inspired by leading platforms.',
              'Fast client-side processing wherever practical in modern browsers.',
              'Server-side precision engines for complex conversions and compressions.',
              'No registration, phone numbers, or passwords required.',
              'No paid plans, tiered subscriptions, or hidden charges.',
              'Zero third-party cloud storage or permanent file retention.',
              'Automated file cleanup within 30 minutes after completion.',
              'No fake tool pages or non-functional mockups.',
              'Full mobile, tablet, and desktop compatibility.',
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 font-medium leading-relaxed">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

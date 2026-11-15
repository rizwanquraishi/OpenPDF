'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Contact & Support
          </h1>
          <p className="text-sm text-gray-500">
            Have questions, feedback, or a feature request? Reach out to the OpenPDF team.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-green-50 rounded-2xl border border-green-200 space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">Thank You for Your Feedback!</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              We appreciate your message. Our team reviews all suggestions to continuously improve OpenPDF.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-green-600 text-white"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-200/80 space-y-4 shadow-sm"
          >
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Your Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Message or Issue</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you like or report an issue with a tool..."
                className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

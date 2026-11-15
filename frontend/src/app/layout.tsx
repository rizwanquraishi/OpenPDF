import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export const metadata: Metadata = {
  title: 'OpenPDF – Free Online PDF Tools | Merge, Compress, Convert & Edit',
  description:
    '100% free, fast, and secure all-in-one PDF utility platform. Merge, split, compress, convert, edit, and protect your PDF documents without registration.',
  keywords: [
    'pdf tools',
    'merge pdf',
    'split pdf',
    'compress pdf',
    'pdf to word',
    'convert pdf',
    'free pdf editor',
    'protect pdf',
    'unlock pdf'
  ],
  authors: [{ name: 'OpenPDF Team' }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

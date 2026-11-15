import React from 'react';
import { Lock, Trash2, Cpu, EyeOff, Server } from 'lucide-react';

export const metadata = {
  title: 'Security Architecture - OpenPDF Document Safety',
  description: 'Learn about OpenPDF security architecture, isolated job directories, memory safety, and 30-minute automatic deletion.',
};

export default function SecurityPage() {
  return (
    <div className="py-16 bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Security Architecture
          </h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            How we engineer document processing safety at every layer of OpenPDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Zero Password Exposure</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When documents are protected or unlocked, passwords are processed exclusively in volatile memory. They are strictly excluded from HTTP logs, error responses, and database entries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Isolated Job Sandboxing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every server operation runs inside a randomly generated UUID directory. User documents are never stored under client-supplied names, preventing path traversal attacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Automated Garbage Collection</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              An asynchronous background cleanup task runs every 10 minutes to verify and permanently erase any job directory older than 30 minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Resource Capping & Timeouts</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Office conversion and compression subprocesses run with strict CPU execution timeouts and upload limits (50 MB default) to avoid Denial of Service (DoS) conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

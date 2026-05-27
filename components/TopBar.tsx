'use client';

import { Bell } from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100 sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title || 'Good morning, Alex 👋'}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{subtitle || today}</p>
      </div>
      <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
        <Bell className="w-5 h-5 text-gray-400" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
      </button>
    </div>
  );
}

'use client';

import { Toaster } from 'react-hot-toast';

export default function HotToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#111827',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '14px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        },
      }}
    />
  );
}

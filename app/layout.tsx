import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import HotToastProvider from '@/components/HotToastProvider';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'MindPulse — AI Mental Wellness',
  description: 'Your personal AI-powered mental wellness companion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAFA]`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0 pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <MobileNav />
        <HotToastProvider />
      </body>
    </html>
  );
}

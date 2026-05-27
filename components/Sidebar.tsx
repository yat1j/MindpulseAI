'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, ClipboardCheck, MessageCircle, ChartBar as BarChart3, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/checkin', label: 'Daily Check-in', icon: ClipboardCheck },
  { href: '/companion', label: 'AI Companion', icon: MessageCircle },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/goals', label: 'Goals & Streaks', icon: Target },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <div>
            <span className="font-700 text-[15px] text-gray-900 tracking-tight">MindPulse</span>
            <div className="flex items-center gap-1 -mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Wellness AI</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-600 uppercase tracking-widest text-gray-400 px-3 mb-3">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn('w-4.5 h-4.5 shrink-0', active ? 'text-violet-600' : 'text-gray-400')}
                strokeWidth={active ? 2.5 : 2}
              />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
            A
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Alex</p>
            <p className="text-[11px] text-gray-400 group-hover:text-violet-500 transition-colors">View Profile</p>
          </div>
          <User className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-400 transition-colors" />
        </button>
      </div>
    </aside>
  );
}

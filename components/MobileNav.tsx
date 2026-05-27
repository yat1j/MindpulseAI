'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardCheck, MessageCircle, ChartBar as BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/checkin', label: 'Check-in', icon: ClipboardCheck },
  { href: '/companion', label: 'Chat', icon: MessageCircle },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/goals', label: 'Goals', icon: Target },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all',
                active ? 'text-violet-600' : 'text-gray-400'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

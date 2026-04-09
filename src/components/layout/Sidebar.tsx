'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Users
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Depósitos', href: '/deposits', icon: Wallet },
  { name: 'Retiros', href: '/withdrawals', icon: CreditCard },
  { name: 'Rendimientos', href: '/yields', icon: TrendingUp },
  { name: 'Referidos Elite', href: '/referrals', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  // Desktop sidebar vs Mobile bottom bar handled with media queries directly
  return (
    <>
      {/* Mobile Floating Command Pill */}
      <nav className="fixed md:hidden bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-[9999] px-6 py-4 bg-[#0a0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex justify-between items-center group overflow-hidden">
        <div className="absolute inset-0 bg-nexus-blue/5 group-hover:bg-nexus-blue/10 transition-colors"></div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-90",
                isActive 
                  ? "text-nexus-blue-light" 
                  : "text-white/20 hover:text-white/60"
              )}
            >
              {isActive && (
                <div className="absolute -inset-1 bg-nexus-blue/20 rounded-2xl blur-lg animate-pulse"></div>
              )}
              <item.icon className={cn("h-6 w-6 relative z-10", isActive ? "drop-shadow-[0_0_12px_rgba(24,136,243,0.8)]" : "")} />
            </Link>
          )
        })}
      </nav>

      {/* Desktop Tactical Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0a0f16] border-r border-white/5 h-[calc(100vh-72px)] p-6 space-y-3 relative overflow-hidden">
        <div className="absolute -left-20 top-20 w-40 h-80 bg-nexus-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center px-5 py-4 text-[11px] font-black rounded-2xl transition-all uppercase tracking-[0.2em] overflow-hidden",
                isActive 
                  ? "bg-white/[0.03] text-nexus-blue-light border border-white/5 shadow-[0_0_20px_rgba(11,64,193,0.05)]" 
                  : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-nexus-blue-light rounded-r-full shadow-[0_0_15px_rgba(24,136,243,1)]"></div>
              )}
              
              <item.icon 
                className={cn(
                  "mr-4 flex-shrink-0 h-4 w-4 transition-all duration-500",
                  isActive ? "text-nexus-blue-light scale-110" : "text-white/20 group-hover:text-white/60"
                )} 
              />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}

        {/* System Monitoring Pulse */}
        <div className="mt-auto pb-4 px-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Network Pulse</span>
               <div className="w-1.5 h-1.5 rounded-full bg-nexus-blue-light animate-pulse shadow-[0_0_8px_rgba(24,136,243,1)]"></div>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-nexus-blue-light w-full shadow-[0_0_10px_rgba(24,136,243,0.5)]"></div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}

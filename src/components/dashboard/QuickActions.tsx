'use client';

import Link from 'next/link';
import { Wallet, ArrowUpCircle, Users2, Zap } from 'lucide-react';

const actions = [
  {
    href: '/deposits',
    icon: Wallet,
    title: 'Adquisición de Capital',
    subtitle: 'Protocolo de Depósito Crypto',
    accent: 'text-nexus-blue-light',
    bg: 'bg-nexus-blue/10',
  },
  {
    href: '/withdrawals',
    icon: ArrowUpCircle,
    title: 'Ejecución de Retiro',
    subtitle: 'Transferencia a Wallet Externa',
    accent: 'text-white',
    bg: 'bg-white/10',
  },
  {
    href: '/referrals',
    icon: Users2,
    title: 'Protocolo Elite',
    subtitle: 'Expansión de Red e Incentivos',
    accent: 'text-nexus-blue-light',
    bg: 'bg-nexus-blue/10',
  },
] as const;

export function QuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="relative group bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 hover:border-nexus-blue/30 transition-all duration-300 backdrop-blur-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        >
          {/* Animated Glow Overlay */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-blue-light/5 blur-[40px] rounded-full group-hover:bg-nexus-blue-light/20 transition-all"></div>
          
          <div
            className={`w-14 h-14 rounded-xl ${action.bg} border border-white/5 flex items-center justify-center ${action.accent} transition-transform group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(11,64,193,0.2)]`}
          >
            <action.icon className="h-7 w-7" />
          </div>
          
          <div className="relative z-10">
            <h4 className="text-white font-black uppercase tracking-tighter group-hover:text-nexus-blue-light transition-colors">{action.title}</h4>
            <p className="text-[10px] font-black text-nexus-text/40 uppercase tracking-widest mt-1">{action.subtitle}</p>
          </div>

          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
             <Zap className="w-4 h-4 text-nexus-blue-light fill-nexus-blue-light" />
          </div>
        </Link>
      ))}
    </section>
  );
}

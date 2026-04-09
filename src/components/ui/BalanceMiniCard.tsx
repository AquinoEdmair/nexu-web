'use client';

import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency } from '@/lib/utils/format';
import { Shield } from 'lucide-react';

export function BalanceMiniCard() {
  const { data } = useBalance();
  const balance = data?.data;

  if (!balance) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between backdrop-blur-xl group hover:border-nexus-blue/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-nexus-blue/10 blur-xl rounded-full"></div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 mb-1">Status Capital</p>
        <p className="text-3xl font-black text-white tracking-tighter">
          ${formatCurrency(balance.balance_total)}
          <span className="text-[10px] text-nexus-blue-light font-black uppercase tracking-widest ml-2">{balance.currency}</span>
        </p>
      </div>
      <div className="h-12 w-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(11,64,193,0.1)]">
        <Shield className="h-6 w-6 text-nexus-blue-light" />
      </div>
    </div>
  );
}

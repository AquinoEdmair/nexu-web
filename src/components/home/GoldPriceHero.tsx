'use client';

import { useGoldPrice } from '@/lib/hooks/useMetrics';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export function GoldPriceHero() {
  const { data, isLoading } = useGoldPrice();

  if (isLoading) {
    return <div className="h-24 w-48 bg-white/5 animate-pulse rounded-2xl border border-white/10" />;
  }

  const isPositive = (data?.change_24h || 0) > 0;

  return (
    <div className="flex flex-col items-start lg:items-end justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,251,251,0.1)] hover:border-primary-500/30 transition-all group">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-primary-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary-400 transition-colors">Spot Gold (XAU)</span>
      </div>
      
      <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">
        {formatCurrency(data?.current || 0)}
      </div>

      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
      }`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}{data?.change_24h}% (24H)
      </div>
    </div>
  );
}

'use client';

import { useUserRanking } from '@/lib/hooks/useMetrics';
import { formatCurrency } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Trophy, Medal, Star, Shield, Crown } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { icon: any, color: string, glow: string }> = {
  'Platino': { icon: Crown,  color: 'text-nexus-blue', glow: 'border-nexus-blue/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]' },
  'Oro':     { icon: Medal,  color: 'text-amber-400',   glow: 'border-amber-500/20' },
  'Plata':   { icon: Star,   color: 'text-slate-300',   glow: 'border-slate-500/20' },
  'Bronce':  { icon: Shield, color: 'text-orange-400',  glow: 'border-orange-500/10' },
};

export function UserRankingTable() {
  const { data, isLoading } = useUserRanking();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data?.data.map((item, index) => {
        const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG['Bronce'];
        const Icon = config.icon;
        const isTopThree = index < 3;

        return (
          <div 
            key={index}
            className={`group flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-white/[0.01] border transition-all hover:bg-white/[0.03] ${config.glow}`}
          >
            {/* Rank Number */}
            <div className="w-8 flex justify-center">
              <span className={`text-xl lg:text-2xl font-black italic tracking-tighter ${isTopThree ? 'text-white' : 'text-white/40'}`}>
                {index + 1}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 flex items-center gap-4">
              <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 ${config.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor] opacity-20 absolute" />
                {item.flag ? (
                  <span className="text-2xl z-10 drop-shadow-md leading-none" title={item.flag}>{item.flag}</span>
                ) : (
                  <Icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor] z-10" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-base font-black text-white tracking-tight uppercase group-hover:text-nexus-blue transition-colors flex items-center gap-2">
                  {item.user_name}
                </span>
                <span className="text-[10px] font-bold text-nexus-text uppercase tracking-[.2em] opacity-80">
                  Inversor {item.category}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className="text-sm lg:text-base font-black text-white tracking-widest font-mono group-hover:text-nexus-blue transition-colors">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-[10px] font-black text-nexus-text uppercase tracking-tighter opacity-60">
                Capital Operativo
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

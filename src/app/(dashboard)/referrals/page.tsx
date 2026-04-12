'use client';

import { Network, ShieldCheck } from 'lucide-react';
import { useReferralSummary } from '@/lib/hooks/useReferrals';
import { EliteProgress } from '@/components/referrals/EliteProgress';
import { ReferralInfo } from '@/components/referrals/ReferralInfo';
import { ReferralNetwork } from '@/components/referrals/ReferralNetwork';
import { ReferralEarnings } from '@/components/referrals/ReferralEarnings';
import { ReferralSkeleton } from '@/components/referrals/ReferralSkeleton';

export default function ReferralsPage() {
  const { data, isLoading, error } = useReferralSummary();
  const summary = data?.data;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">
              Módulo: Programa de Referidos
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Membresía Elite
          </h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">
            Expande tu red NEXU y desbloquea comisiones por rendimientos gestionados.
          </p>
        </div>
        {summary && (
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Nivel: Elite {summary.elite.tier?.name ?? 'Sin Nivel'}
            </span>
          </div>
        )}
      </header>

      {isLoading && <ReferralSkeleton />}

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-4 text-sm text-red-400">
          No pudimos cargar tu información de referidos. Intenta recargar la página.
        </div>
      )}

      {summary && (
        <>
          <EliteProgress 
            elite={summary.elite} 
            totalPersonalDeposit={summary.stats.total_personal_deposit} 
          />
          <ReferralInfo summary={summary} />
          <ReferralNetwork />
          <ReferralEarnings stats={summary.stats} />
        </>
      )}
    </main>
  );
}

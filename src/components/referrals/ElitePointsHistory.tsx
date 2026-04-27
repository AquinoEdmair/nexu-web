'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useElitePointsHistory } from '@/lib/hooks/useReferrals';
import { useTranslations } from 'next-intl';

const SOURCE_COLORS: Record<string, string> = {
  'depósito':          'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'rendimiento':       'text-nexus-blue-light bg-nexus-blue/10 border-nexus-blue/20',
  'comisión_referido': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  'ajuste_admin':      'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'otro':              'text-white/40 bg-white/5 border-white/10',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}

export function ElitePointsHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useElitePointsHistory(page);
  const t = useTranslations('referrals');

  const entries  = data?.data ?? [];
  const meta     = data?.meta;
  const lastPage = meta?.last_page ?? 1;

  const SOURCE_LABELS: Record<string, string> = {
    'depósito':          t('sourceDeposit'),
    'rendimiento':       t('sourceYield'),
    'comisión_referido': t('sourceReferral'),
    'ajuste_admin':      t('sourceAdmin'),
    'otro':              t('sourceOther'),
  };

  return (
    <section className="rounded-[2.5rem] p-8 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-nexus-blue/10 rounded-2xl border border-nexus-blue/20">
          <Trophy className="w-5 h-5 text-nexus-blue-light" />
        </div>
        <div>
          <h3 className="text-white font-black tracking-tighter uppercase text-lg">{t('pointsHistoryTitle')}</h3>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
            {meta ? t('totalRecords', { total: meta.total }) : t('colSource')}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <p className="text-center text-white/30 text-sm py-10 font-medium">
          {t('noPoints')}
        </p>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 mb-3 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
            <span>{t('colSource')}</span>
            <span className="text-right">{t('colAmountUSD')}</span>
            <span className="text-right">{t('colPoints')}</span>
            <span className="text-right">{t('colDate')}</span>
          </div>

          <div className="space-y-2">
            {entries.map((entry) => {
              const label = SOURCE_LABELS[entry.source] ?? entry.source;
              const color = SOURCE_COLORS[entry.source] ?? SOURCE_COLORS['otro'];
              const pts   = parseFloat(entry.points).toLocaleString('es-MX', { maximumFractionDigits: 2 });
              const usd   = parseFloat(entry.amount_usd) > 0
                ? `$${parseFloat(entry.amount_usd).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '—';

              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border w-fit ${color}`}>
                      {label}
                    </span>
                    {entry.source_user_masked && (
                      <span className="text-[9px] text-white/40 font-medium px-1">
                        {entry.source_user_masked}
                      </span>
                    )}
                  </div>
                  <span className="text-white/40 text-sm font-mono text-right">{usd}</span>
                  <span className="text-nexus-blue-light font-black text-sm tracking-tighter text-right">
                    +{pts} <span className="text-[10px] text-white/30">pts</span>
                  </span>
                  <span className="text-white/30 text-xs font-medium text-right whitespace-nowrap">{formatDate(entry.created_at)}</span>
                </div>
              );
            })}
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> {t('prev')}
              </button>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                {page} / {lastPage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                {t('next')} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

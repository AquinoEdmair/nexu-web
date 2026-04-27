'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Download, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { useYields } from '@/lib/hooks/useYields';
import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency } from '@/lib/utils/format';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import { useTranslations } from 'next-intl';
import { ExportModal } from '@/components/ui/ExportModal';

type ChartRange = { label: string; hours: number; days: number };
const CHART_RANGES: ChartRange[] = [
  { label: '1H', hours: 1, days: 0 },
  { label: '1D', hours: 0, days: 1 },
  { label: '1S', hours: 0, days: 7 },
  { label: '1M', hours: 0, days: 30 },
];

export default function YieldsPage() {
  const [page, setPage] = useState(1);
  const [chartRangeIdx, setChartRangeIdx] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const t = useTranslations('yields');

  const chartDays = CHART_RANGES[chartRangeIdx].days;
  const chartHours = CHART_RANGES[chartRangeIdx].hours;
  const { data: yieldsData, isLoading: yieldsLoading } = useYields(page);

  const fetchDays = chartDays > 0 ? (chartDays === 1 ? 2 : chartDays + 3) : 0;
  const fetchHours = chartHours > 0 ? chartHours + 1 : 0;
  const { data: chartData, isLoading: chartLoading } = useYields(1, 500, fetchDays, fetchHours);
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  const history = yieldsData?.data || [];
  const monthlyYield = history.reduce((acc, curr) => acc + parseFloat(curr.amount_applied), 0);
  const totalInOperation = balanceData?.data?.balance_in_operation || '0';
  const lastPage = yieldsData?.meta?.last_page ?? 1;

  const chartPoints = useMemo(() => {
    const today = new Date();
    let start: Date, end: Date, stepMs: number;

    if (chartHours === 1) {
      stepMs = 10 * 60 * 1000;
      end = new Date(today);
      end.setSeconds(0, 0);
      const m = end.getMinutes();
      end.setMinutes(m - (m % 10) + 10);
      start = new Date(end.getTime() - (60 * 60 * 1000));
    } else if (chartDays === 1) {
      stepMs = 60 * 60 * 1000;
      end = new Date(today);
      end.setMinutes(0, 0, 0);
      end.setHours(end.getHours() + 1);
      start = new Date(end.getTime() - (24 * 60 * 60 * 1000));
    } else {
      stepMs = 24 * 60 * 60 * 1000;
      today.setHours(0, 0, 0, 0);
      end = new Date(today);
      start = new Date(today.getTime() - (chartDays * 24 * 60 * 60 * 1000));
    }

    const buckets: { time: Date; amount: number; balance: number | null }[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      buckets.push({ time: cur, amount: 0, balance: null });
      cur = new Date(cur.getTime() + stepMs);
    }

    const entries = (chartData?.data || []).slice().reverse();
    let lastKnownBalance = entries.length > 0 ? parseFloat(entries[0].balance_before) : 0;

    for (const entry of entries) {
      const time = new Date(entry.created_at).getTime();
      const diff = time - start.getTime();
      if (diff < 0) {
        lastKnownBalance = parseFloat(entry.balance_after);
        continue;
      }
      const index = Math.floor(diff / stepMs);
      if (index >= 0 && index < buckets.length) {
        buckets[index].amount += parseFloat(entry.amount_applied);
        buckets[index].balance = parseFloat(entry.balance_after);
        lastKnownBalance = buckets[index].balance;
      }
    }

    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].balance === null) {
        buckets[i].balance = lastKnownBalance;
      } else {
        lastKnownBalance = buckets[i].balance!;
      }
    }

    return buckets.map(b => {
      let label = '';
      if (chartHours === 1 || chartDays === 1) {
        label = b.time.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
      } else {
        label = b.time.toLocaleDateString('es', { day: '2-digit', month: 'short' });
      }
      return { time: label, amount: b.amount, balance: b.balance };
    });
  }, [chartData, chartDays, chartHours]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">{t('pageStatus')}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{t('pageTitle')}</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">{t('pageSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('pageSecurity')}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
          <section className="relative overflow-hidden rounded-3xl p-8 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] group hover:border-nexus-blue/30 transition-all">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-nexus-blue/5 rounded-full blur-3xl group-hover:bg-nexus-blue/10 transition-colors"></div>

            <div className="relative z-10 space-y-2">
              <p className="text-nexus-blue-light/40 font-black text-[9px] tracking-[0.3em] uppercase">
                {t('inOperation')}
              </p>
              <div className="flex items-baseline gap-2">
                {balanceLoading ? (
                  <div className="h-12 w-32 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <FormattedAmount amount={totalInOperation} className="text-5xl" />
                )}
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/20">
                <Activity className="w-3 h-3 text-nexus-blue-light" />
                <span className="text-nexus-blue-light text-[10px] font-black uppercase tracking-widest">{t('realtimeYield')}</span>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-blue/20 transition-all">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">
                  {t('periodYield')}
                </p>
                <div className="flex items-end justify-between">
                  {yieldsLoading ? (
                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                  ) : (
                    <FormattedAmount amount={monthlyYield} className="text-2xl" />
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-nexus-blue-light font-black mb-1">
                    <TrendingUp className="w-3 h-3" />
                    {t('active')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl hover:border-nexus-blue/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                {t('chart')}
              </h3>
              <Activity className={`w-4 h-4 text-nexus-blue-light/40 ${chartLoading ? 'animate-pulse' : ''}`} />
            </div>

            <div className="flex gap-1 mb-4 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
              {CHART_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setChartRangeIdx(i)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    i === chartRangeIdx
                      ? 'bg-nexus-blue text-white shadow-[0_0_10px_rgba(24,136,243,0.3)]'
                      : 'text-white/20 hover:text-white/60'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="h-44 w-full">
              {chartLoading ? (
                <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />
              ) : chartPoints.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{t('noData')}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartPoints} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1888F3" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1888F3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.25)', fontWeight: 700 }}
                      interval="preserveStartEnd"
                      dy={6}
                    />
                    <YAxis hide domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, 0.1)]} />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-[#0a0c10] border border-white/10 px-3 py-2 rounded-xl text-[10px]">
                            <p className="text-white/40 font-bold mb-0.5">{payload[0].payload.time}</p>
                            <p className="text-nexus-blue-light font-black">+{formatCurrency(String(payload[0].payload.amount))}</p>
                            <p className="text-white/30 font-bold">Balance: {formatCurrency(String(payload[0].payload.balance))}</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#1888F3"
                      strokeWidth={2}
                      fill="url(#yieldGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#1888F3', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </aside>

        <section className="lg:col-span-8 space-y-6">
          {showExport && <ExportModal onClose={() => setShowExport(false)} />}
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{t('historyTitle')}</h2>
            <button
              onClick={() => setShowExport(true)}
              className="text-[10px] text-nexus-blue-light font-black tracking-widest uppercase flex items-center gap-2 px-4 py-2 bg-nexus-blue/5 border border-nexus-blue/10 rounded-xl hover:bg-nexus-blue hover:text-white transition-all"
            >
              {t('export')} <Download className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto min-w-[600px]">
              <div className="grid grid-cols-12 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 border-b border-white/10 bg-white/5">
                <div className="col-span-4">{t('tableRecord')}</div>
                <div className="col-span-4 text-center">{t('tableYield')}</div>
                <div className="col-span-4 text-right">{t('tableBalance')}</div>
              </div>

              {yieldsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-8 py-6 border-b border-white/5 animate-pulse">
                    <div className="col-span-4 space-y-2">
                      <div className="h-3 w-20 bg-white/10 rounded" />
                      <div className="h-2 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="col-span-4 flex flex-col items-center gap-1">
                      <div className="h-4 w-12 bg-white/10 rounded" />
                      <div className="h-2 w-16 bg-white/5 rounded" />
                    </div>
                    <div className="col-span-4 flex flex-col items-end gap-1">
                      <div className="h-2 w-12 bg-white/5 rounded" />
                      <div className="h-4 w-20 bg-white/10 rounded" />
                    </div>
                  </div>
                ))
              ) : history.length > 0 ? (
                history.map((row) => (
                  <div key={row.id} className="grid grid-cols-12 items-center px-8 py-6 hover:bg-white/[0.02] transition-colors border-b border-white/5 group">
                    <div className="col-span-4 space-y-2">
                      <p className="text-xs font-black text-white tracking-tighter uppercase">
                        {new Date(row.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-white/20 font-black tracking-widest uppercase">
                        {new Date(row.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                      <span className="inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase bg-white/5 border-white/5 text-white/30">
                        {row.yield_log?.description || t('vaultYield')}
                      </span>
                      {row.yield_log?.applied_by && typeof row.yield_log.applied_by === 'object' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase bg-nexus-blue/5 border-nexus-blue/10 text-nexus-blue-light/50">
                          <span className="text-[7px]">AD</span>
                          {row.yield_log.applied_by.name}
                        </span>
                      )}
                    </div>
                    <div className="col-span-4 text-center space-y-1">
                      <p className="text-base font-black text-nexus-blue-light tracking-tighter">
                        {parseFloat(row.amount_applied) >= 0 ? '+' : ''}{formatCurrency(row.amount_applied)}
                      </p>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        {t('generatedBy')} {row.yield_log?.type || 'NEXU'}
                      </p>
                    </div>
                    <div className="col-span-4 text-right space-y-1">
                      <p className="text-[10px] text-white/10 font-black line-through tracking-widest">
                        {formatCurrency(row.balance_before)}
                      </p>
                      <p className="text-sm font-black text-white tracking-tighter">
                        {formatCurrency(row.balance_after)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-20 text-center">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">{t('noHistory')}</p>
                </div>
              )}
            </div>

            {lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 py-6 border-t border-white/5 bg-white/[0.02]">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  {t('prev')}
                </button>
                <span className="text-[10px] font-black text-nexus-blue-light">{t('pagination', { page, lastPage })}</span>
                <button
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  {t('next')}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

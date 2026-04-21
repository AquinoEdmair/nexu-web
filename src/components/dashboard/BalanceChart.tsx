'use client';

import { useState, useMemo } from 'react';
import { useYields } from '@/lib/hooks/useYields';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

const PERIOD_OPTIONS = [
  { label: '1H', hours: 1, days: 0 },
  { label: '1D', hours: 0, days: 1 },
  { label: '1S', hours: 0, days: 7 },
  { label: '1M', hours: 0, days: 30 },
  { label: '3M', hours: 0, days: 90 },
  { label: '6M', hours: 0, days: 180 },
] as const;

const PAD_DAYS = 3;

const TOOLTIP_STYLE = {
  backgroundColor: '#0a0f16',
  border: '1px solid rgba(11,64,193,0.3)',
  borderRadius: '12px',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.9)',
} as const;

const AXIS_TICK = { fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 } as const;

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function shortLabel(ymd: string): string {
  const d = new Date(ymd + 'T00:00:00');
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function BalanceChart() {
  const t = useTranslations('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const selected = PERIOD_OPTIONS[selectedPeriod];
  const days = selected.days;
  const hours = selected.hours;

  // For 1H, fetch 2 hours (for padding). For 1D, fetch 2 days. Others, days + PAD_DAYS.
  const fetchDays = days > 0 ? (days === 1 ? 2 : days + PAD_DAYS) : 0;
  const fetchHours = hours > 0 ? hours + 1 : 0;

  const { data: yieldsData, isLoading } = useYields(1, 500, fetchDays, fetchHours);

  const chartData = useMemo(() => {
    const today = new Date();
    
    let start: Date, end: Date, stepMs: number;
    
    if (hours === 1) {
      // 10 minute intervals
      stepMs = 10 * 60 * 1000;
      end = new Date(today);
      end.setSeconds(0, 0);
      const minutesRem = end.getMinutes() % 10;
      end.setMinutes(end.getMinutes() - minutesRem + 10);
      start = new Date(end.getTime() - (2 * 60 * 60 * 1000)); // 2 hours
    } else if (days === 1) {
      // 1 hour intervals
      stepMs = 60 * 60 * 1000;
      end = new Date(today);
      end.setMinutes(0, 0, 0);
      end.setHours(end.getHours() + 1);
      start = new Date(end.getTime() - (36 * 60 * 60 * 1000)); // 36 hours
    } else {
      // 1 day intervals
      stepMs = 24 * 60 * 60 * 1000;
      today.setHours(0, 0, 0, 0);
      end = addDays(today, PAD_DAYS);
      start = addDays(today, -(days + PAD_DAYS));
    }

    const map: Record<string, number> = {};
    let cur = new Date(start);
    while (cur <= end) {
      map[cur.toISOString()] = 0;
      cur = new Date(cur.getTime() + stepMs);
    }

    const getBucket = (dateStr: string) => {
      const d = new Date(dateStr).getTime();
      const diff = d - start.getTime();
      if (diff < 0) return null;
      const steps = Math.floor(diff / stepMs);
      return new Date(start.getTime() + steps * stepMs).toISOString();
    };

    for (const entry of yieldsData?.data ?? []) {
      const b = getBucket(entry.created_at);
      if (b && b in map) {
        map[b] += parseFloat(entry.amount_applied);
      }
    }

    const nowTime = today.getTime();
    const periodStart = hours === 1 
      ? nowTime - (60 * 60 * 1000)
      : days === 1 
      ? nowTime - (24 * 60 * 60 * 1000)
      : today.getTime() - (days * 24 * 60 * 60 * 1000);

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, total]) => {
        const d = new Date(iso);
        let label = '';
        if (hours === 1 || days === 1) {
          label = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        } else {
          label = d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
        }

        const bucketTime = d.getTime();
        // pad logic
        const isPad = bucketTime < periodStart || bucketTime > nowTime;
        // isToday logic (if daily, it checks exact day. If hourly, it checks current hour. If 10m, checks current 10m)
        let isToday = false;
        if (hours === 1) {
           isToday = bucketTime <= nowTime && bucketTime > nowTime - stepMs;
        } else if (days === 1) {
           isToday = bucketTime <= nowTime && bucketTime > nowTime - stepMs;
        } else {
           isToday = toYMD(d) === toYMD(today);
        }

        return {
          iso,
          label,
          total: parseFloat(total.toFixed(2)),
          isToday,
          isPad,
        };
      });
  }, [yieldsData, days, hours]);

  const hasData = chartData.some((d) => d.total > 0);
  const totalYield = chartData.reduce((s, d) => s + (d.isPad ? 0 : d.total), 0);

  if (isLoading) {
    return (
      <div className="xl:col-span-2 relative h-[452px]">
        <div className="h-full bg-white/5 border border-white/5 rounded-3xl flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/40 uppercase">{t('chartAnalyzing')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-2 relative group flex flex-col">
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl h-full transition-all hover:border-nexus-blue/20">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-nexus-blue-light" />
              <span className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/80 uppercase">{t('chartLabel')}</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{t('chartTitle')}</h3>
            <p className="text-xs text-nexus-text/40 font-medium tracking-tight mt-1">
              {t('chartSubtitle')}
              {hasData && (
                <span className="text-nexus-blue-light ml-2 font-black">
                  {t('chartTotal', { total: totalYield.toFixed(2) })}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {PERIOD_OPTIONS.map((option, i) => (
              <button
                key={option.label}
                onClick={() => setSelectedPeriod(i)}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                  i === selectedPeriod
                    ? 'bg-nexus-blue text-white shadow-[0_0_20px_rgba(11,64,193,0.3)]'
                    : 'text-white/20 hover:text-white hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {!hasData ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3">
              <TrendingUp className="w-10 h-10 text-white/5" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('chartNoData')}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  interval={hours === 1 ? 0 : days === 1 ? 2 : days <= 7 ? 0 : days <= 30 ? 2 : 'preserveStartEnd'}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  tickFormatter={(v: number) => v === 0 ? '' : `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                  width={60}
                  dx={-4}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '9px', marginBottom: '4px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  formatter={(value) => [
                    Number(value) > 0 ? `+$${Number(value).toFixed(2)}` : '$0.00',
                    t('chartYield'),
                  ]}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.total === 0
                          ? 'rgba(255,255,255,0.04)'
                          : entry.isPad
                          ? 'rgba(24,136,243,0.25)'
                          : entry.isToday
                          ? '#1888F3'
                          : 'rgba(24,136,243,0.6)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-white/20">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-blue inline-block" /> {t('legendToday')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-blue/60 inline-block" /> {t('legendPeriod')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-blue/25 inline-block" /> {t('legendPad')}
          </span>
        </div>
      </div>
    </div>
  );
}

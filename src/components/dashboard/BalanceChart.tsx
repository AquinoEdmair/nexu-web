'use client';

import { useState, useMemo } from 'react';
import { useYields } from '@/lib/hooks/useYields';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

const PERIOD_OPTIONS = [
  { label: '1S', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
] as const;

const PAD_DAYS = 3;

const TOOLTIP_STYLE = {
  backgroundColor: '#0a0f16',
  border: '1px solid rgba(11,64,193,0.3)',
  borderRadius: '12px',
  fontSize: '11px',
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
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const days = PERIOD_OPTIONS[selectedPeriod].days;

  // Fetch enough yields to cover period + padding
  const { data: yieldsData, isLoading } = useYields(1, 500, days + PAD_DAYS);

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build date range: [today - days - PAD_DAYS, today + PAD_DAYS]
    const start = addDays(today, -(days + PAD_DAYS));
    const end   = addDays(today, PAD_DAYS);

    // Init every day in range with 0
    const map: Record<string, number> = {};
    let cur = new Date(start);
    while (cur <= end) {
      map[toYMD(cur)] = 0;
      cur = addDays(cur, 1);
    }

    // Aggregate yields by day
    for (const entry of yieldsData?.data ?? []) {
      const ymd = entry.created_at.slice(0, 10);
      if (ymd in map) {
        map[ymd] = (map[ymd] ?? 0) + parseFloat(entry.amount_applied);
      }
    }

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ymd, total]) => ({
        ymd,
        label: shortLabel(ymd),
        total: parseFloat(total.toFixed(2)),
        isToday: ymd === toYMD(today),
        isPad: ymd < toYMD(addDays(today, -days)) || ymd > toYMD(today),
      }));
  }, [yieldsData, days]);

  const hasData = chartData.some((d) => d.total > 0);
  const totalYield = chartData.reduce((s, d) => s + (d.isPad ? 0 : d.total), 0);

  if (isLoading) {
    return (
      <div className="xl:col-span-2 relative h-[452px]">
        <div className="h-full bg-white/5 border border-white/5 rounded-3xl flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/40 uppercase">Analizando Trayectoria...</p>
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
              <span className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/80 uppercase">Análisis Temporal de Activos</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Radar de Crecimiento</h3>
            <p className="text-xs text-nexus-text/40 font-medium tracking-tight mt-1">
              Rendimientos por día — período seleccionado
              {hasData && (
                <span className="text-nexus-blue-light ml-2 font-black">
                  Total: +${totalYield.toFixed(2)}
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
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sin rendimientos en el período</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK}
                  interval={days <= 7 ? 0 : days <= 30 ? 2 : 'preserveStartEnd'}
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
                    'Rendimiento'
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
            <span className="w-3 h-3 rounded-sm bg-nexus-blue inline-block" /> Hoy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-blue/60 inline-block" /> Período
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nexus-blue/25 inline-block" /> ±3 días
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useBalanceHistory } from '@/lib/hooks/useBalanceHistory';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

const PERIOD_OPTIONS = [
  { label: '1S', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
] as const;

const TOOLTIP_STYLE = {
  backgroundColor: '#0a0f16',
  border: '1px solid rgba(11,64,193,0.3)',
  borderRadius: '12px',
  fontSize: '11px',
} as const;

const AXIS_TICK = { fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 } as const;

function formatAxisValue(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function BalanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const days = PERIOD_OPTIONS[selectedPeriod].days;
  const { data, isLoading, isError } = useBalanceHistory(days);

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

  if (isError || !data?.data?.length) {
    return null;
  }

  const chartData = data.data.map((entry) => ({
    date: entry.date,
    total: parseFloat(entry.balance_total),
    label: new Date(entry.date).toLocaleDateString('es', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="xl:col-span-2 relative group flex flex-col">
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl h-full transition-all hover:border-nexus-blue/20">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-nexus-blue-light" />
              <span className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/80 uppercase">Análisis Temporal de Activos</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Radar de Crecimiento</h3>
            <p className="text-xs text-nexus-text/40 font-medium tracking-tight">Evolución algorítmica de la infraestructura de capital</p>
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

        <div className="flex-grow min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B40C1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0B40C1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                interval="preserveStartEnd"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
                tickFormatter={formatAxisValue}
                width={70}
                dx={-10}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: '9px', marginBottom: '4px' }}
                itemStyle={{ color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}
                formatter={(value) => [formatAxisValue(Number(value)), 'Capital Estándar']}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#1888F3"
                strokeWidth={3}
                fill="url(#balanceGradient)"
                animationDuration={2000}
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: '#1888F3', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

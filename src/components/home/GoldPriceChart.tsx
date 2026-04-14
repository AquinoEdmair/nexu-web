'use client';

import { useState } from 'react';
import { useGoldPrice } from '@/lib/hooks/useMetrics';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

type Range = '1h' | '1d' | '1w' | '1m';

const RANGES: { label: string; value: Range }[] = [
  { label: '1H', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '1S', value: '1w' },
  { label: '1M', value: '1m' },
];

const RANGE_LABELS: Record<Range, string> = {
  '1h': 'Última hora',
  '1d': 'Últimas 24h',
  '1w': 'Última semana',
  '1m': 'Último mes',
};

export function GoldPriceChart() {
  const [range, setRange] = useState<Range>('1w');
  const { data, isLoading, isFetching } = useGoldPrice(range);

  const currentPrice = data?.current ?? 0;
  const isPositive   = (data?.change_24h ?? 0) >= 0;

  return (
    <div className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
            MÉTRICA DE VALOR: XAU / USD
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white tracking-tighter">
              {isLoading ? '—' : `$${formatCurrency(currentPrice)}`}
            </span>
            {!isLoading && (
              <div className={`flex items-center gap-1 mb-1 text-sm font-bold ${isPositive ? 'text-nexus-blue-light' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}{data?.change_24h}%
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1">
            {RANGES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRange(value)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  range === value
                    ? 'bg-nexus-blue text-white shadow-[0_0_12px_rgba(24,136,243,0.3)]'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-nexus-blue/10 p-2.5 rounded-xl border border-nexus-blue/20">
            <Activity className={`w-5 h-5 text-nexus-blue-light ${isFetching ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        {isLoading ? (
          <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.data}>
              <defs>
                <linearGradient id="colorGoldPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1888F3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0B40C1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="date" hide={true} />
              <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0a0c10] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                        <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-widest">
                          {payload[0].payload.date}
                        </p>
                        <p className="text-white font-black text-lg tracking-tighter">
                          ${formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#1888F3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGoldPrice)"
                animationDuration={600}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        <span>{RANGE_LABELS[range]}</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isFetching ? 'bg-amber-400' : 'bg-nexus-blue-light'} animate-pulse`} />
          {isFetching ? 'Actualizando...' : 'Live · cada 10s'}
        </span>
      </div>
    </div>
  );
}

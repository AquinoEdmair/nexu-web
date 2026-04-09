'use client';

import { useGoldPrice } from '@/lib/hooks/useMetrics';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Info, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export function GoldPriceChart() {
  const { data, isLoading } = useGoldPrice();

  if (isLoading) {
    return (
      <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />
    );
  }

  const currentPrice = data?.current || 0;
  const isPositive = (data?.change_24h || 0) > 0;

  return (
    <Card className="border-white/5 bg-slate-900/40 backdrop-blur-md p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            MÉTRICA DE VALOR: XAU / USD
            <Info className="w-3 h-3 opacity-70 cursor-pointer hover:opacity-100" />
          </h3>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-4xl font-black text-white tracking-tighter">
              {formatCurrency(currentPrice)}
            </span>
            <div className={`flex items-center gap-1 mb-1 text-sm font-bold ${isPositive ? 'text-nexus-blue-light' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{data?.change_24h}%
            </div>
          </div>
        </div>
        
        <div className="bg-nexus-blue/10 p-3 rounded-xl border border-nexus-blue/20 shadow-[0_0_15px_rgba(11,64,193,0.1)]">
          <Activity className="w-6 h-6 text-nexus-blue-light" />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1888F3" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0B40C1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
              dataKey="date" 
              hide={true}
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0a0c10] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                      <p className="text-slate-500 text-[10px] mb-1 font-bold uppercase tracking-widest">{payload[0].payload.date}</p>
                      <p className="text-white font-black text-lg tracking-tighter">
                        {formatCurrency(payload[0].value as number)}
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
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        <span>Histórico: Últimos 7 días</span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-nexus-blue-light animate-pulse"></span>
          Actualizado cada 60s
        </span>
      </div>
    </Card>
  );
}

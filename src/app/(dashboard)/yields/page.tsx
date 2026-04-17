'use client';

import React, { useState } from 'react';
import { TrendingUp, Download, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { useYields } from '@/lib/hooks/useYields';
import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency } from '@/lib/utils/format';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartRange = { label: string; days: number };
const CHART_RANGES: ChartRange[] = [
  { label: 'Hoy',  days: 1  },
  { label: '1S',   days: 7  },
  { label: '1M',   days: 30 },
];

export default function YieldsPage() {
  const [page, setPage] = useState(1);
  const [chartRangeIdx, setChartRangeIdx] = useState(0);

  const chartDays = CHART_RANGES[chartRangeIdx].days;
  const { data: yieldsData, isLoading: yieldsLoading } = useYields(page);
  const { data: chartData, isLoading: chartLoading } = useYields(1, 500, chartDays);
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  const history = yieldsData?.data || [];
  const monthlyYield = history.reduce((acc, curr) => acc + parseFloat(curr.amount_applied), 0);
  const totalInOperation = balanceData?.data?.balance_in_operation || '0';
  const lastPage = yieldsData?.meta?.last_page ?? 1;

  const chartEntries = (chartData?.data || []).slice().reverse();
  const chartPoints = chartEntries.map((r) => ({
    time: chartDays === 1
      ? new Date(r.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      : new Date(r.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' }) +
        ' ' + new Date(r.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    amount: parseFloat(r.amount_applied),
    balance: parseFloat(r.balance_after),
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Rendimientos Gestionados</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Control de Rendimientos</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Análisis y proyección de crecimiento de capital respaldado en oro.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Protección de Bóveda Activa</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Generator Stats */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
          <section className="relative overflow-hidden rounded-3xl p-8 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] group hover:border-nexus-blue/30 transition-all">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-nexus-blue/5 rounded-full blur-3xl group-hover:bg-nexus-blue/10 transition-colors"></div>

            <div className="relative z-10 space-y-2">
              <p className="text-nexus-blue-light/40 font-black text-[9px] tracking-[0.3em] uppercase">
                Balance en Operación
              </p>
              <div className="flex items-baseline gap-2">
                {balanceLoading ? (
                  <div className="h-12 w-32 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <h2 className="text-5xl font-black text-white tracking-tighter">{formatCurrency(totalInOperation)}</h2>
                )}
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/20">
                <Activity className="w-3 h-3 text-nexus-blue-light" />
                <span className="text-nexus-blue-light text-[10px] font-black uppercase tracking-widest">Rendimientos en Tiempo Real</span>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-blue/20 transition-all">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">
                  Rendimiento del Periodo
                </p>
                <div className="flex items-end justify-between">
                   {yieldsLoading ? (
                     <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                   ) : (
                     <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(monthlyYield)}</p>
                   )}
                   <div className="flex items-center gap-1 text-[10px] text-nexus-blue-light font-black mb-1">
                      <TrendingUp className="w-3 h-3" />
                      ACTIVO
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Yield Chart */}
          <section className="p-6 rounded-3xl bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl hover:border-nexus-blue/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                Gráfica de Rendimiento
              </h3>
              <Activity className={`w-4 h-4 text-nexus-blue-light/40 ${chartLoading ? 'animate-pulse' : ''}`} />
            </div>

            {/* Range filters */}
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

            <div className="h-36 w-full">
              {chartLoading ? (
                <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />
              ) : chartPoints.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Sin datos en el período</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartPoints} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1888F3" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1888F3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
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
                      dataKey="balance"
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

        {/* Right Column: Historical Ledger */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Historial de Rendimientos</h2>
            <button className="text-[10px] text-nexus-blue-light font-black tracking-widest uppercase flex items-center gap-2 px-4 py-2 bg-nexus-blue/5 border border-nexus-blue/10 rounded-xl hover:bg-nexus-blue hover:text-white transition-all">
              Exportar Registro <Download className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto min-w-[600px]">
              <div className="grid grid-cols-12 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 border-b border-white/10 bg-white/5">
                <div className="col-span-4">Registro</div>
                <div className="col-span-4 text-center">Rendimiento Aplicado</div>
                <div className="col-span-4 text-right">Balance de Capital</div>
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
                        {row.yield_log?.description || 'RENDIMIENTO DE BÓVEDA'}
                      </span>
                    </div>
                    <div className="col-span-4 text-center space-y-1">
                      <p className="text-base font-black text-nexus-blue-light tracking-tighter">
                        {parseFloat(row.amount_applied) >= 0 ? '+' : ''}{formatCurrency(row.amount_applied)}
                      </p>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        GENERADO POR {row.yield_log?.type || 'NEXU'}
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
                   <p className="text-white/20 font-black uppercase tracking-widest text-xs">No se han detectado registros en el historial</p>
                 </div>
              )}
            </div>

            {/* Pagination Controls */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 py-6 border-t border-white/5 bg-white/[0.02]">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Anterior
                </button>
                <span className="text-[10px] font-black text-nexus-blue-light">PÁGINA {page} / {lastPage}</span>
                <button
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

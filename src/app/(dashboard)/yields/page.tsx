'use client';

import React, { useState } from 'react';
import { TrendingUp, Award, Download, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useYields } from '@/lib/hooks/useYields';
import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function YieldsPage() {
  const [page, setPage] = useState(1);
  const { data: yieldsData, isLoading: yieldsLoading } = useYields(page);
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  const history = yieldsData?.data || [];
  
  // Calculate Monthly Yield (simplified: sum of the current page for now)
  const monthlyYield = history.reduce((acc, curr) => acc + parseFloat(curr.amount_applied), 0);
  
  // Total yield accumulated - ideally this would come from the API, 
  // but we'll show the balance in operation context here.
  const totalInOperation = balanceData?.balance_in_operation || '0';

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Generación Algorítmica</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Radar de Rendimientos</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Análisis y proyección de crecimiento de capital mediante IA.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo de Sync Activo</span>
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
                <span className="text-nexus-blue-light text-[10px] font-black uppercase tracking-widest">Sincronización en Tiempo Real</span>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-blue/20 transition-all">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">
                  Acumulado Reciente (Pág.)
                </p>
                <div className="flex items-end justify-between">
                   {yieldsLoading ? (
                     <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                   ) : (
                     <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(monthlyYield)}</p>
                   )}
                   <div className="flex items-center gap-1 text-[10px] text-nexus-blue-light font-black mb-1">
                      <TrendingUp className="w-3 h-3" />
                      AUTO-SIGNAL
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projection Visualizer */}
          <section className="p-8 rounded-3xl bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl group hover:border-nexus-blue/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                Vector de Proyección
              </h3>
              <Activity className="w-4 h-4 text-nexus-blue-light/20 group-hover:animate-pulse" />
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="yieldChartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1888F3" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#1888F3" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,75 100,60 T200,50 T300,35 T400,15 L400,100 L0,100 Z" fill="url(#yieldChartGradient)"></path>
                <path d="M0,80 Q50,75 100,60 T200,50 T300,35 T400,15" fill="none" stroke="#1888F3" strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(24,136,243,0.5)]"></path>
              </svg>
            </div>
            <div className="flex justify-between mt-4">
               {['0%', '50%', '100%'].map(mark => (
                 <span key={mark} className="text-[8px] text-white/20 font-black">{mark}</span>
               ))}
            </div>
          </section>
        </aside>

        {/* Right Column: Historical Ledger */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Historial Algorítmico</h2>
            <button className="text-[10px] text-nexus-blue-light font-black tracking-widest uppercase flex items-center gap-2 px-4 py-2 bg-nexus-blue/5 border border-nexus-blue/10 rounded-xl hover:bg-nexus-blue hover:text-white transition-all">
              Exportar Protocolo <Download className="w-3 h-3" />
            </button>
          </div>
          
          <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto min-w-[600px]">
              <div className="grid grid-cols-12 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 border-b border-white/10 bg-white/5">
                <div className="col-span-4">Registro / Origen</div>
                <div className="col-span-4 text-center">Incidencia</div>
                <div className="col-span-4 text-right">Balance de Red</div>
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
                        {formatDate(row.created_at)}
                      </p>
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase bg-white/5 border-white/5 text-white/30`}>
                        {row.yield_log?.description || 'RENDIMIENTO DE BÓVEDA'}
                      </span>
                    </div>
                    <div className="col-span-4 text-center space-y-1">
                      <p className="text-base font-black text-nexus-blue-light tracking-tighter">
                        {parseFloat(row.amount_applied) >= 0 ? '+' : ''}{formatCurrency(row.amount_applied)}
                      </p>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        AJUSTE POR {row.yield_log?.type || 'SISTEMA'}
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
            {yieldsData && yieldsData.last_page > 1 && (
              <div className="flex justify-center items-center gap-4 py-6 border-t border-white/5 bg-white/[0.02]">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Regresión
                </button>
                <span className="text-[10px] font-black text-nexus-blue-light">VECTOR {page} / {yieldsData.last_page}</span>
                <button 
                  onClick={() => setPage(p => Math.min(yieldsData.last_page, p + 1))}
                  disabled={page === yieldsData.last_page}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Proyección
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


'use client';

import React from 'react';
import { TrendingUp, Award, Download, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function YieldsPage() {
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
                Acumulado Táctico Total
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-black text-white tracking-tighter">$3,450.20</h2>
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/20">
                <Zap className="w-3 h-3 text-nexus-blue-light fill-nexus-blue-light" />
                <span className="text-nexus-blue-light text-[10px] font-black uppercase tracking-widest">+12.4% ALL-TIME</span>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-blue/20 transition-all">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">
                  Rendimiento Mensual
                </p>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-white tracking-tighter">$412.80</p>
                   <div className="flex items-center gap-1 text-[10px] text-nexus-blue-light font-black mb-1">
                      <TrendingUp className="w-3 h-3" />
                      +8.2%
                   </div>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-nexus-blue/5 border border-nexus-blue/10 hover:border-nexus-blue/30 transition-all">
                <p className="text-[9px] text-nexus-blue-light/40 font-black uppercase tracking-[0.2em] mb-2">
                  Multiplicador Activo
                </p>
                <div className="flex items-end justify-between">
                   <p className="text-2xl font-black text-nexus-blue-light tracking-tighter uppercase">1.25x</p>
                   <div className="flex items-center gap-1 text-[9px] text-nexus-blue-light/40 font-black mb-1">
                      <Award className="w-3 h-3" />
                      Bóveda Lvl 3
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
              
              {[
                { date: 'MAY 12, 2024', type: 'RENDIMIENTO DE BÓVEDA', pct: '+2.00%', amount: '+$82.40', old: '$4,120.00', new: '$4,202.40' },
                { date: 'MAY 05, 2024', type: 'RECOMPENSA DE RED', pct: '+$50.00', amount: 'BONO AFILIADO', old: '$4,070.00', new: '$4,120.00', elite: true },
                { date: 'APR 28, 2024', type: 'RENDIMIENTO DE BÓVEDA', pct: '+1.85%', amount: '+$74.12', old: '$3,995.88', new: '$4,070.00' },
                { date: 'APR 21, 2024', type: 'RENDIMIENTO DE BÓVEDA', pct: '+2.15%', amount: '+$84.22', old: '$3,911.66', new: '$3,995.88' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 items-center px-8 py-6 hover:bg-white/[0.02] transition-colors border-b border-white/5 group">
                  <div className="col-span-4 space-y-2">
                    <p className="text-xs font-black text-white tracking-tighter uppercase">{row.date}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase ${row.elite ? 'bg-nexus-blue-light/10 border-nexus-blue-light/20 text-nexus-blue-light' : 'bg-white/5 border-white/5 text-white/30'}`}>
                      {row.type}
                    </span>
                  </div>
                  <div className="col-span-4 text-center space-y-1">
                    <p className="text-base font-black text-nexus-blue-light tracking-tighter">{row.pct}</p>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{row.amount}</p>
                  </div>
                  <div className="col-span-4 text-right space-y-1">
                    <p className="text-[10px] text-white/10 font-black line-through tracking-widest">{row.old}</p>
                    <p className="text-sm font-black text-white tracking-tighter">{row.new}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


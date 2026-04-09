'use client';

import { Download, Search, Calendar, ArrowDownLeft, ArrowUpRight, TrendingUp, Users, ChevronLeft, ChevronRight, Hash, ShieldCheck } from 'lucide-react';

export default function HistoryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Auditoría Global</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Log de Operaciones</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Registro inmutable de sincronización de activos y flujos de red.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-nexus-blue hover:bg-nexus-blue-light text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(11,64,193,0.3)] flex items-center gap-2 border border-nexus-blue/20 group">
            <Download className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            Exportar Protocolo
          </button>
        </div>
      </header>

      {/* Analytical Filters Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0a0f16]/40 border border-white/5 p-5 rounded-2xl backdrop-blur-xl group hover:border-nexus-blue/20 transition-all">
          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block ml-1">Filtro de Texto</label>
          <div className="relative flex items-center bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/[0.08] transition-colors">
            <Search className="absolute left-3 text-nexus-blue-light/40 h-4 w-4" />
            <input className="bg-transparent border-none focus:ring-0 w-full pl-6 text-xs text-white placeholder:text-white/10 outline-none font-black uppercase tracking-tighter" placeholder="TXID, ASSET, NODE..." type="text" />
          </div>
        </div>

        <div className="bg-[#0a0f16]/40 border border-white/5 p-5 rounded-2xl backdrop-blur-xl group hover:border-nexus-blue/20 transition-all">
          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block ml-1">Clase de Actividad</label>
          <div className="relative bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/[0.08] transition-colors">
            <select className="bg-transparent border-none outline-none focus:ring-0 w-full text-xs text-nexus-blue-light font-black uppercase tracking-widest cursor-pointer appearance-none">
              <option>Actividad Total</option>
              <option>Depósito</option>
              <option>Retiro</option>
              <option>Rendimiento</option>
              <option>Comisión</option>
            </select>
          </div>
        </div>

        <div className="bg-[#0a0f16]/40 border border-white/5 p-5 rounded-2xl backdrop-blur-xl group hover:border-nexus-blue/20 transition-all">
          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block ml-1">Estado de Nodo</label>
          <div className="relative bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/[0.08] transition-colors">
            <select className="bg-transparent border-none outline-none focus:ring-0 w-full text-xs text-nexus-blue-light font-black uppercase tracking-widest cursor-pointer appearance-none">
              <option>Todos los Estados</option>
              <option>Completado</option>
              <option>Pendiente</option>
              <option>Fallido</option>
            </select>
          </div>
        </div>

        <div className="bg-[#0a0f16]/40 border border-white/5 p-5 rounded-2xl backdrop-blur-xl group hover:border-nexus-blue/20 transition-all">
          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block ml-1">Ventana Temporal</label>
          <div className="flex items-center justify-between cursor-pointer bg-white/5 p-3 rounded-xl border border-white/5 group-hover:bg-white/[0.08] transition-colors">
            <span className="text-xs text-white/60 font-black uppercase tracking-widest">30 Ciclos [Días]</span>
            <Calendar className="text-nexus-blue-light/40 h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Operations Ledger Table */}
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Marca Temporal</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Clase de Operación</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Bruto</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Neto Delta</th>
                <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Sintonía</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: 'OCT 24, 2023', time: '14:22:10', type: 'Depósito', id: 'TX-8v2k...m9p', color: 'nexus-blue-light', icon: ArrowDownLeft, amount: '12,500.00', status: 'Sincronizado' },
                { date: 'OCT 22, 2023', time: '09:15:44', type: 'Retiro', id: 'TX-4x9f...k2z', color: 'red-500', icon: ArrowUpRight, amount: '-2,001.50', status: 'Pendiente', warning: true },
                { date: 'OCT 20, 2023', time: '00:00:01', type: 'Rendimiento', id: 'Distribución Alg', color: 'nexus-blue-light', icon: TrendingUp, amount: '412.55', status: 'Sincronizado' },
                { date: 'OCT 18, 2023', time: '11:40:02', type: 'Comisión', id: 'Recompensa Nodo', color: 'nexus-blue-light', icon: Users, amount: '50.00', status: 'Sincronizado' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white tracking-widest uppercase">{row.date}</span>
                      <span className="text-[10px] text-white/20 font-black tracking-widest">{row.time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 shrink-0 rounded-xl bg-${row.color}/10 border border-${row.color}/20 flex items-center justify-center`}>
                        <row.icon className={`h-4 w-4 text-${row.color}`} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white uppercase tracking-tighter block">{row.type}</span>
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{row.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-xs text-white tracking-widest uppercase">{row.amount} USDT</td>
                  <td className={`px-8 py-6 text-right font-black text-sm tracking-widest text-${row.color}`}>
                    {row.amount.startsWith('-') ? row.amount : `+${row.amount}`}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full border ${row.warning ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-nexus-blue-light/10 border-nexus-blue-light/30 text-nexus-blue-light'} text-[9px] font-black uppercase tracking-[0.2em]`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tactical Pagination */}
        <div className="px-10 py-8 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
          <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Auditoría de Entradas: 1 - 4 [Total: 258]</span>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-nexus-blue text-white font-black text-[10px] shadow-[0_0_15px_rgba(11,64,193,0.5)] border border-nexus-blue-light/20">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white transition-all text-[10px] font-black border border-white/5">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white transition-all text-[10px] font-black border border-white/5">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


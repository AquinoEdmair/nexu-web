'use client';

import { Star, Copy, Share2, Users, Network, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export default function ReferralsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Expansión de Red</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Protocolo de Afiliación</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Escala tu infraestructura mediante la sincronización de nuevos nodos.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Estado: Elite Gold Ready</span>
        </div>
      </header>

      {/* Hero Section: Infrastructure Progress */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-10 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] group hover:border-nexus-blue/20 transition-all">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-nexus-blue/5 rounded-full blur-[100px] group-hover:bg-nexus-blue/10 transition-colors"></div>
        
        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-nexus-blue-light/40 uppercase tracking-[0.3em] block mb-2">Categoría de Membresía</span>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Nivel Plata</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">Próximo Hito</span>
              <p className="text-nexus-blue-light font-black text-xl uppercase tracking-widest">Elite Oro</p>
            </div>
          </div>

          {/* Progress Bar Tactical */}
          <div className="space-y-6">
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5 p-1">
              <div className="h-full bg-gradient-to-r from-nexus-blue to-nexus-blue-light w-[65%] rounded-full shadow-[0_0_20px_rgba(24,136,243,0.4)] relative">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-black tracking-[0.3em] uppercase text-white/20">
              <span className="text-white/40">Bronce</span>
              <span className="text-nexus-blue-light">Plata</span>
              <span className="group-hover:text-nexus-blue-light transition-colors">Oro</span>
              <span className="text-white/10">Platino</span>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="p-3 bg-nexus-blue/10 rounded-2xl border border-nexus-blue/20">
               <Star className="h-6 w-6 text-nexus-blue-light fill-nexus-blue-light" />
            </div>
            <p className="text-sm text-nexus-text/60 font-medium">
              Estás a <span className="text-white font-black tracking-tighter">$12,450</span> de desbloquear los <span className="text-nexus-blue-light font-black uppercase tracking-widest text-[10px]">Beneficios Oro Elite</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Links Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0a0f16]/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col justify-between space-y-8 hover:border-nexus-blue/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <h3 className="text-white/20 font-black tracking-[0.3em] uppercase text-[9px] mb-4">Identidad Operativa</h3>
            <div className="flex items-center justify-between bg-white/5 px-6 py-5 rounded-2xl border border-white/5 group/code cursor-pointer">
              <span className="text-2xl font-black tracking-[0.2em] text-white">NEXU-K82J</span>
              <button className="text-nexus-blue-light hover:scale-110 transition-transform">
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-nexus-text/40 font-medium leading-relaxed uppercase tracking-wider">Distribuye tu identificador para captar el 5% de comisión recurrente por nodo activo.</p>
        </div>

        <div className="bg-[#0a0f16]/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col justify-between space-y-8 hover:border-nexus-blue/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div>
            <h3 className="text-white/20 font-black tracking-[0.3em] uppercase text-[9px] mb-4">Interfaz de Acceso</h3>
            <div className="flex items-center justify-between bg-white/5 px-6 py-5 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-white/60 truncate pr-4 uppercase tracking-tighter">app.nexu.exchange/ref/nexu-k82j</span>
              <button className="text-nexus-blue-light hover:scale-110 transition-transform">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0f16] bg-nexus-blue-light/10 flex items-center justify-center">
                   <Users className="w-4 h-4 text-nexus-blue-light/40" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#0a0f16] bg-nexus-blue-light flex items-center justify-center text-[10px] font-black text-white relative z-10 shadow-[0_0_15px_rgba(24,136,243,0.5)]">
                +12
              </div>
            </div>
            <span className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest ml-1">Nodos Activos en Red</span>
          </div>
        </div>
      </section>

      {/* Network Ledger Table */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Registro de Nodos</h2>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-nexus-blue-light fill-nexus-blue-light" />
            <span className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">Sincronización Total</span>
          </div>
        </div>

        <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Afiliado / Nodo</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 text-center">Estatus Global</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Comisiones HD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { email: 'ma***@proton.me', joined: 'OCT 24, 2023', status: 'Activo', amount: '$1,240.50' },
                  { email: 'al***@gmail.com', joined: 'SEP 12, 2023', status: 'Activo', amount: '$892.20' },
                  { email: 'th***@icloud.com', joined: 'AUG 05, 2023', status: 'Inactivo', amount: '$340.00', idle: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-tighter uppercase">{row.email}</span>
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Inscrito: {row.joined}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${row.idle ? 'bg-white/10' : 'bg-nexus-blue-light animate-pulse shadow-[0_0_10px_rgba(24,136,243,1)]'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${row.idle ? 'text-white/20' : 'text-nexus-blue-light'}`}>{row.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xl font-black text-white tracking-tighter">{row.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Command: Reinvest Capital */}
      <section className="pb-10">
        <div className="bg-[#0a0f16]/60 border border-nexus-blue-light/20 p-10 rounded-[2.5rem] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-nexus-blue/20 group-hover:bg-nexus-blue-light transition-colors"></div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-[10px] font-black text-nexus-blue-light/40 uppercase tracking-[0.4em]">Capital Acumulado de Red</h3>
            <p className="text-5xl font-black text-white tracking-tighter">$2,472.70</p>
          </div>
          <button className="bg-nexus-blue hover:bg-nexus-blue-light text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(11,64,193,0.3)] hover:shadow-[0_15px_40px_rgba(24,136,243,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10 overflow-hidden group/btn">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
            Reinversión de Capital <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
}


'use client';

import { ShieldCheck, Zap, Lock, ChevronRight, CheckCircle2, Cpu, Globe, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function SidebarInfo() {
  return (
    <div className="space-y-12">
      {/* What is NEXU */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-nexus-blue-light">
          <Cpu className="w-5 h-5 shadow-[0_0_10px_rgba(24,136,243,0.3)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tecnología Core</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
          El puente definitivo hacia el Oro Cripto.
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed font-medium">
          NEXU es una arquitectura de inversión automatizada que permite exposición directa al metal precioso usando activos digitales, sin la fricción del trading tradicional.
        </p>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: <Globe className="w-4 h-4" />, title: 'Global', desc: 'Acceso 24/7' },
          { icon: <Lock className="w-4 h-4" />, title: 'Seguro', desc: 'Cifrado HMAC' },
          { icon: <Zap className="w-4 h-4" />, title: 'Instantáneo', desc: 'Retiros Rápidos' },
          { icon: <Rocket className="w-4 h-4" />, title: 'Escalable', desc: 'Interés Compuesto' },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-nexus-blue-light-light mb-2">{f.icon}</div>
            <div className="text-xs font-black text-white mb-1 uppercase tracking-tighter">{f.title}</div>
            <div className="text-[10px] text-slate-400 font-bold">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Protocolo de Operación</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10"></div>
          
          {[
            { n: '01', t: 'Depósito Inteligente', d: 'Fondea tu cuenta vía USDT/BTC.' },
            { n: '02', t: 'Ejecución Automática', d: 'Tu capital entra en el flujo de trading.' },
            { n: '03', t: 'Retiros de Utilidad', d: 'Cobranza garantizada en tu wallet.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-nexus-blue/40 flex items-center justify-center text-[10px] font-black text-nexus-blue-light shadow-[0_0_15px_rgba(11,64,193,0.2)]">
                {s.n}
              </div>
              <div className="flex-1 pt-1">
                <div className="text-sm font-black text-white mb-1 uppercase tracking-tight">{s.t}</div>
                <div className="text-xs text-slate-400 font-medium">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Badge */}
      <Card className="bg-nexus-blue/5 border-nexus-blue/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex gap-4 items-start relative z-10">
          <ShieldCheck className="w-8 h-8 text-nexus-blue-light shrink-0 shadow-[0_0_20px_rgba(24,136,243,0.2)]" />
          <div>
            <div className="text-sm font-black text-white mb-1 uppercase tracking-tighter">Capa de Seguridad NEXU</div>
            <p className="text-[11px] text-slate-300 leading-normal font-medium">
              Todas las operaciones están protegidas por firmas HMAC y validación multi-nivel fuera de cadena.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

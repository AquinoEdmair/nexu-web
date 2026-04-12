'use client';

import { WithdrawalForm } from '@/components/withdrawals/WithdrawalForm';
import { WithdrawalHistory } from '@/components/withdrawals/WithdrawalHistory';
import { BalanceMiniCard } from '@/components/ui/BalanceMiniCard';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function WithdrawalsPage() {
  return (
    <main className="max-w-7xl mx-auto pt-6 pb-32 px-4 md:px-8 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Gestión de Retiros</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Retiro de Fondos</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Solicitud de retiros mediante procesos de validación segura.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Seguridad de Retiro Activa</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Control Panel: Balance & Form (4 columns) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Balance Disponible</h2>
            <BalanceMiniCard />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Gestionar Retiro</h2>
            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden group hover:border-nexus-blue/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-nexus-blue/20 group-hover:bg-nexus-blue-light transition-colors" />
              <WithdrawalForm />
            </div>
          </div>
        </aside>

        {/* Tactical Ledger: History (8 columns) */}
        <section className="lg:col-span-8">
          <WithdrawalHistory />
        </section>
      </div>
    </main>
  );
}


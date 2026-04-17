'use client';

import { WithdrawalForm } from '@/components/withdrawals/WithdrawalForm';
import { WithdrawalHistory } from '@/components/withdrawals/WithdrawalHistory';
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

      <WithdrawalForm />
      <WithdrawalHistory />
    </main>
  );
}


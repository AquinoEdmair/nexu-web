'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Shield, Radio } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Estado: Protección Activa</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Panel de Inversión</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Gestión de inversión en oro físico mediante criptomonedas.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <Shield className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Garantía de Bóveda</span>
        </div>
      </header>

      {/* Hero Section: Capital Infrastructure */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BalanceCard />
        <div className="lg:col-span-1 bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center relative overflow-hidden group hover:border-nexus-blue/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-nexus-blue/10 blur-3xl rounded-full"></div>
           <div className="space-y-4">
              <p className="text-[10px] font-black text-nexus-blue-light/60 uppercase tracking-widest">Seguridad de Capital</p>
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">Respaldo en Oro Físico</h4>
              <p className="text-xs text-nexus-text/40 leading-relaxed">Tu inversión está respaldada por tecnología blockchain y colateralización en oro 24/7 en bóvedas de alta seguridad.</p>
           </div>
        </div>
      </section>

      {/* Primary Actions: Tactical Commands */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] pl-1">Acciones Rápidas</h2>
        <QuickActions />
      </div>

      {/* Data Visualization: Analytics & Ledger */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] pl-1">Evolución y Movimientos</h2>
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <BalanceChart />
          <RecentTransactions />
        </section>
      </div>
    </main>
  );
}

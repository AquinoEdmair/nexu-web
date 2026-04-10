'use client';

import Link from 'next/link';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { Plus, Minus, TrendingUp, Gift, ArrowRightLeft, Activity, Loader2 } from 'lucide-react';
import type { Transaction } from '@/types/models';

const TYPE_CONFIG: Record<Transaction['type'], { icon: typeof Plus; color: string; bg: string; label: string }> = {
  deposit:              { icon: Plus,            color: 'text-nexus-blue-light',  bg: 'bg-nexus-blue/10',    label: 'Depósito' },
  withdrawal:           { icon: Minus,           color: 'text-red-400',          bg: 'bg-red-500/10',       label: 'Retiro' },
  yield:                { icon: TrendingUp,      color: 'text-nexus-blue-light',  bg: 'bg-nexus-blue/10',    label: 'Rendimiento' },
  commission:           { icon: ArrowRightLeft,  color: 'text-yellow-400',       bg: 'bg-yellow-500/10',    label: 'Comisión' },
  referral_commission:  { icon: Gift,            color: 'text-nexus-blue-light',  bg: 'bg-nexus-blue/10',    label: 'Bono Referido' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
}

function formatSignedAmount(amount: string, type: Transaction['type']): string {
  const sign = type === 'withdrawal' || type === 'commission' ? '-' : '+';
  return `${sign}$${formatCurrency(amount)}`;
}

export function RecentTransactions() {
  const { data, isLoading, isError, refetch } = useTransactions({ per_page: 5 });

  if (isLoading) {
    return (
      <div className="bg-[#0a0f16]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col justify-center items-center gap-4 min-h-[460px]">
        <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
        <p className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/40 uppercase">Sincronizando Ledger...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0a0f16]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col justify-center items-center text-center gap-4 min-h-[460px]">
        <Activity className="h-8 w-8 text-red-400 animate-pulse" />
        <div>
          <h4 className="text-white font-black uppercase tracking-tight">Fallo en la Sincronía</h4>
          <button onClick={() => refetch()} className="text-nexus-blue-light text-xs font-black uppercase hover:underline mt-2">
            Reintentar Protocolo
          </button>
        </div>
      </div>
    );
  }

  const transactions = data?.data ?? [];

  return (
    <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all hover:border-nexus-blue/20 flex flex-col min-h-[460px]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-nexus-blue-light" />
            <span className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/80 uppercase">Registro de Operaciones</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Movimientos</h3>
        </div>
        <Link
          href="/history"
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white hover:bg-nexus-blue hover:border-nexus-blue transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(24,136,243,0.05)]"
        >
          Ver Todo
        </Link>
      </div>

      <div className="space-y-6 flex-grow">
        {transactions.length === 0 ? (
          <div className="py-12 text-center opacity-40">
            <p className="text-xs font-black uppercase tracking-widest">Sin registros tácticos activos</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.yield;
            const Icon = config.icon;

            return (
              <div key={tx.id} className="flex items-center gap-4 group cursor-default">
                <div className={`w-11 h-11 shrink-0 rounded-2xl ${config.bg} border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-black text-white truncate uppercase tracking-tighter">{config.label}</p>
                    <span className="text-[10px] font-black text-nexus-blue-light/40">{tx.currency}</span>
                  </div>
                  <p className="text-[10px] font-black text-nexus-text/30 uppercase tracking-[0.1em]">{formatDate(tx.created_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-black tracking-tight ${config.color}`}>
                    {formatSignedAmount(tx.net_amount, tx.type)}
                  </p>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] py-0.5 px-2 rounded-full border ${tx.status === 'confirmed' ? 'border-nexus-blue/20 text-nexus-blue-light' : 'border-white/10 text-nexus-text/40'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

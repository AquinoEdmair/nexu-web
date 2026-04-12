'use client';

import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency } from '@/lib/utils/format';
import { Shield, Wallet, CheckCircle2, Loader2 } from 'lucide-react';

export function BalanceCard() {
  const { data, isLoading, isError, refetch } = useBalance();

  if (isLoading) {
    return (
      <div className="lg:col-span-2 relative group h-[320px]">
        <div className="absolute inset-0 bg-nexus-blue blur-3xl opacity-5 rounded-full -z-10"></div>
        <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/40 uppercase">Actualizando Datos de Inversión...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:col-span-2 relative group h-[320px]">
        <div className="h-full bg-white/5 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center text-center gap-4">
          <div className="bg-red-500/10 p-4 rounded-full">
            <Wallet className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-tight">Error de Sincronización</h4>
            <button onClick={() => refetch()} className="text-nexus-blue-light text-xs font-black uppercase hover:underline mt-2">
              Reintentar Conexión
            </button>
          </div>
        </div>
      </div>
    );
  }

  const balance = data?.data;
  if (!balance) return null;

  return (
    <div className="lg:col-span-2 relative group min-h-[320px]">
      <div className="absolute inset-0 bg-nexus-blue blur-[100px] opacity-5 rounded-full -z-10"></div>
      <div className="h-full bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden transition-all hover:border-nexus-blue/30 shadow-[0_0_50px_rgba(11,64,193,0.05)] flex flex-col justify-between">
        
        {/* Background Emblem */}
        <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
          <Shield className="w-64 h-64 text-nexus-blue-light" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-nexus-blue-light animate-pulse"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/80 uppercase">Capital en Operación NEXU</span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Balance Consolidado en Oro</p>
            <div className="flex items-baseline gap-4">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(24,136,243,0.2)]">
                ${formatCurrency(balance.balance_total)}
              </h2>
              <span className="text-nexus-blue-light font-black text-lg uppercase tracking-[0.2em]">{balance.currency}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Disponible para Retiro</p>
            <p className="text-xl font-black text-white group-hover:text-nexus-blue-light transition-colors">
              ${formatCurrency(balance.balance_available)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Capital en Operación</p>
            <p className="text-xl font-black text-gray-400">
              ${formatCurrency(balance.balance_in_operation)}
            </p>
          </div>
          <div className="hidden md:block space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Estado de Seguridad</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-nexus-blue-light" />
              <p className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">Protección Activa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

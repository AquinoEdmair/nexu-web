'use client';

import { useState } from 'react';
import { useWithdrawals } from '@/lib/hooks/useWithdrawals';
import { useCancelWithdrawal } from '@/lib/hooks/useCancelWithdrawal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { Wallet, X, Activity, Database, ArrowRight, ArrowLeft } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending:   { label: 'Pendiente',  classes: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]' },
  approved:  { label: 'Enviado',   classes: 'bg-nexus-blue/10 text-nexus-blue-light border-nexus-blue/20 shadow-[0_0_10px_rgba(11,64,193,0.1)]' },
  completed: { label: 'Liquidado', classes: 'bg-nexus-blue-light/10 text-nexus-blue-light border-nexus-blue-light/20 shadow-[0_0_10px_rgba(24,136,243,0.1)]' },
  rejected:  { label: 'Denegado',  classes: 'bg-red-400/10 text-red-400 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)] shadow-none grayscale' },
};

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  };
}

function truncateAddress(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export function WithdrawalHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useWithdrawals({ 
    page,
    refetchInterval: 8000 
  });
  const { mutate: cancelWithdrawal, isPending: isCancelling } = useCancelWithdrawal();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    setCancellingId(id);
    cancelWithdrawal(id);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0f16]/40 border border-white/5 rounded-3xl p-10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[400px]">
        <Activity className="w-10 h-10 text-nexus-blue-light animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-nexus-blue-light/40">Sincronizando Ledger de Salida...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0a0f16]/40 border border-red-500/20 rounded-3xl p-12 backdrop-blur-xl text-center">
        <h2 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">Fallo de Comunicación</h2>
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2 bg-nexus-blue/10 text-nexus-blue-light rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-nexus-blue hover:text-white transition-all border border-nexus-blue/20"
        >
          Reintentar Protocolo
        </button>
      </div>
    );
  }

  const withdrawals = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-nexus-blue-light" />
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Registro de Salida</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-nexus-blue-light rounded-full animate-pulse shadow-[0_0_10px_rgba(24,136,243,0.5)]" />
          <span className="text-[9px] text-nexus-blue-light font-black uppercase tracking-[0.2em]">En Vivo</span>
        </div>
      </div>

      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl transition-all hover:border-nexus-blue/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {['Registro', 'Liquidación', 'Protocolo', 'Nodo Destino', 'Estatus', ''].map((header) => (
                  <th key={header} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center opacity-20">
                    <p className="text-xs font-black uppercase tracking-[0.5em]">Sin registros de liquidación activos</p>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => {
                  const { date, time } = formatDate(w.created_at);
                  const status = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.pending;
                  const isThisCancelling = cancellingId === w.id && isCancelling;

                  return (
                    <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white tracking-tighter">{date}</span>
                          <span className="text-[10px] text-white/20 font-black tracking-widest">{time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-base font-black text-white tracking-tighter">${formatCurrency(w.amount)}</span>
                          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Valor Bruto</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="px-2 py-1 bg-white/5 rounded-lg border border-white/5 inline-flex items-center">
                          <span className="text-[10px] font-black text-nexus-blue-light">{w.currency}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="text-[10px] font-black font-mono text-white/40 tracking-tighter bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          {truncateAddress(w.destination_address)}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {w.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(w.id)}
                            disabled={isThisCancelling}
                            className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/10 hover:border-red-500 disabled:opacity-20 group/btn"
                          >
                            <X className={`h-4 w-4 transition-transform ${isThisCancelling ? 'animate-spin' : 'group-hover/btn:scale-110'}`} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-3 rounded-2xl bg-white/5 text-nexus-blue-light disabled:opacity-10 hover:bg-nexus-blue hover:text-white transition-all border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-white tracking-widest">{meta.current_page}</span>
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">/</span>
            <span className="text-xs font-black text-white/40 tracking-widest">{meta.last_page}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="p-3 rounded-2xl bg-white/5 text-nexus-blue-light disabled:opacity-10 hover:bg-nexus-blue hover:text-white transition-all border border-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}


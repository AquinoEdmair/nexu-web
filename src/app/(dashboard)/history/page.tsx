'use client';

import { useState } from 'react';
import {
  ArrowDownLeft, ArrowUpRight,
  TrendingUp, Users, ChevronLeft, ChevronRight, Hash,
  Loader2, AlertCircle
} from 'lucide-react';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import type { Transaction } from '@/types/models';

const TYPE_ICONS: Record<string, any> = {
  deposit:             { icon: ArrowDownLeft, label: 'Depósito',        color: 'nexus-blue-light' },
  withdrawal:          { icon: ArrowUpRight,  label: 'Retiro',          color: 'red-500' },
  yield:               { icon: TrendingUp,    label: 'Rendimiento',     color: 'nexus-blue-light' },
  commission:          { icon: Users,         label: 'Comisión',        color: 'nexus-blue-light' },
  investment:          { icon: TrendingUp,    label: 'Inversión',       color: 'nexus-blue-light' },
  referral_commission: { icon: Users,         label: 'Com. Referido',   color: 'nexus-blue-light' },
  admin_adjustment:    { icon: Users,         label: 'Ajuste Admin',    color: 'nexus-blue-light' },
};

const ADMIN_TYPES = new Set(['withdrawal', 'yield', 'admin_adjustment']);

const STATUS_MAP: Record<string, { label: string, className: string }> = {
  confirmed: { label: 'Sincronizado', className: 'bg-nexus-blue-light/10 border-nexus-blue-light/30 text-nexus-blue-light' },
  completed: { label: 'Sincronizado', className: 'bg-nexus-blue-light/10 border-nexus-blue-light/30 text-nexus-blue-light' },
  pending:   { label: 'Pendiente',    className: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
  failed:    { label: 'Fallido',      className: 'bg-red-500/10 border-red-500/30 text-red-500' },
};

export default function HistoryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useTransactions({
    page,
    per_page: 15,
  });

  const transactions = data?.data || [];
  const meta = data?.meta;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Transparencia de Capital</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Registro de Movimientos</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Historial inmutable de ingresos, retiros y rendimientos generados.</p>
        </div>
      </header>

      {/* Operations Ledger Table */}
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-nexus-blue-light animate-spin" />
            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Actualizando Historial...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-red-500/60">
            <AlertCircle className="w-12 h-12" />
            <p className="text-[10px] font-black tracking-[0.4em] uppercase">Error de Conexión</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Hash className="w-12 h-12 text-white/5" />
            <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Sin Actividad en Registro</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Registro</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Tipo de Movimiento</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Monto Bruto</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Balance Neto</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx: Transaction) => {
                  const typeInfo = TYPE_ICONS[tx.type] || { icon: Hash, label: tx.type, color: 'white' };
                  const statusInfo = STATUS_MAP[tx.status] || { label: tx.status, className: 'bg-white/5 text-white/40 border-white/10' };
                  const isNegative = parseFloat(tx.amount) < 0 || tx.type === 'withdrawal';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white tracking-widest uppercase">
                            {new Date(tx.created_at || '').toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                          </span>
                          <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">
                            {new Date(tx.created_at || '').toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 shrink-0 rounded-xl bg-${typeInfo.color}/10 border border-${typeInfo.color}/20 flex items-center justify-center`}>
                            <typeInfo.icon className={`h-4 w-4 text-${typeInfo.color}`} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-white uppercase tracking-tighter block">{typeInfo.label}</span>
                            <span className="text-[9px] text-white/20 font-black uppercase tracking-widest truncate max-w-[120px] block">
                              {tx.external_tx_id || `REF-${tx.id.substring(0, 8)}`}
                            </span>
                            {ADMIN_TYPES.has(tx.type) && tx.admin_name && (
                              <span className="text-[8px] font-black text-nexus-blue-light/50 uppercase tracking-widest block mt-0.5">
                                AD · {tx.admin_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-xs text-white tracking-widest uppercase">
                        {formatCurrency(tx.amount)} {tx.currency}
                      </td>
                      <td className={`px-8 py-6 text-right font-black text-sm tracking-widest text-${typeInfo.color}`}>
                        {isNegative ? '-' : '+'}{formatCurrency(tx.net_amount || tx.amount)}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tactical Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-10 py-8 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
              Registros: {((meta.current_page - 1) * meta.per_page) + 1} - {Math.min(meta.current_page * meta.per_page, meta.total)} [Total: {meta.total}]
            </span>
            <div className="flex items-center gap-3">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 disabled:opacity-20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Generate page numbers simplified */}
              {Array.from({ length: Math.min(meta.last_page, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button 
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-[10px] transition-all border ${
                      p === page 
                        ? 'bg-nexus-blue text-white shadow-[0_0_15px_rgba(11,64,193,0.5)] border-nexus-blue-light/20' 
                        : 'bg-white/5 text-white/60 hover:text-white border-white/5'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button 
                disabled={page === meta.last_page}
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 disabled:opacity-20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


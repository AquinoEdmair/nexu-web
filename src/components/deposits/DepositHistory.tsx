'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Database, CheckCircle2, Clock, XCircle, Eye, Copy, Check } from 'lucide-react';
import { useDeposits } from '@/lib/hooks/useDeposits';
import { formatCurrency } from '@/lib/utils/format';
import type { DepositRequest } from '@/types/models';
import { DepositInstructions } from './DepositInstructions';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending:          { label: 'Pendiente',          icon: Clock,         className: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  client_confirmed: { label: 'En revisión',         icon: Eye,           className: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  completed:        { label: 'Completado',          icon: CheckCircle2,  className: 'bg-nexus-blue/10 border-nexus-blue/30 text-nexus-blue-light' },
  cancelled:        { label: 'Cancelado',           icon: XCircle,       className: 'bg-red-500/10 border-red-500/30 text-red-400' },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="p-1 text-white/20 hover:text-white/60 transition-colors">
      {copied ? <Check className="w-3 h-3 text-nexus-blue-light" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export function DepositHistory() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<DepositRequest | null>(null);

  const { data, isLoading } = useDeposits(page);
  const deposits = data?.data ?? [];
  const meta = data?.meta;

  const handleUpdate = (updated: DepositRequest) => {
    setSelected(updated);
  };

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al historial
        </button>
        <DepositInstructions deposit={selected} onUpdated={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
      <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
        <Database className="w-4 h-4 text-nexus-blue-light" />
        <span className="text-[10px] font-black text-nexus-blue-light/60 uppercase tracking-[0.4em]">Historial de depósitos</span>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-nexus-blue-light/30 border-t-nexus-blue-light animate-spin" />
        </div>
      ) : deposits.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <Database className="w-10 h-10 text-white/5" />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sin depósitos aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Moneda</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Monto</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">TX Hash</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deposits.map((dep: DepositRequest) => {
                const status = STATUS_CONFIG[dep.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = status.icon;

                return (
                  <tr key={dep.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white tracking-widest uppercase">
                          {new Date(dep.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-white/20 font-black tracking-widest">
                          {new Date(dep.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{dep.currency}</span>
                        {dep.network && <span className="block text-[9px] text-white/20 font-black uppercase tracking-widest">{dep.network}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-sm text-nexus-blue-light tracking-widest">
                      ${formatCurrency(dep.amount_expected)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {dep.tx_hash ? (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10px] text-white/40">{dep.tx_hash.substring(0, 12)}...</span>
                          <CopyButton text={dep.tx_hash} />
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelected(dep)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-nexus-blue/20 text-white/40 hover:text-nexus-blue-light transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="px-8 py-6 bg-white/5 flex items-center justify-between border-t border-white/5">
          <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
            {meta.total} registros
          </span>
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 disabled:opacity-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{page} / {meta.last_page}</span>
            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-all border border-white/5 disabled:opacity-20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

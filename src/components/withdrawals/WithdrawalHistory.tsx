'use client';

import { useState, useEffect } from 'react';
import { useWithdrawals } from '@/lib/hooks/useWithdrawals';
import { useCancelWithdrawal } from '@/lib/hooks/useCancelWithdrawal';
import { formatCurrency } from '@/lib/utils/format';
import { X, Activity, Database, ArrowRight, ArrowLeft, Clock, ChevronDown, Copy, Check, ExternalLink, Hash, AlertTriangle } from 'lucide-react';
import type { WithdrawalRequest } from '@/types/models';

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending:   { label: 'Pendiente',  classes: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]' },
  approved:  { label: 'Enviado',   classes: 'bg-nexus-blue/10 text-nexus-blue-light border-nexus-blue/20 shadow-[0_0_10px_rgba(11,64,193,0.1)]' },
  completed: { label: 'Liquidado', classes: 'bg-nexus-blue-light/10 text-nexus-blue-light border-nexus-blue-light/20 shadow-[0_0_10px_rgba(24,136,243,0.1)]' },
  rejected:  { label: 'Denegado',  classes: 'bg-red-400/10 text-red-400 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)] shadow-none grayscale' },
  cancelled: { label: 'Cancelado', classes: 'bg-white/5 text-white/30 border-white/10 grayscale' },
};

function useCancellationCountdown(createdAt: string): number {
  const getSecondsLeft = () => {
    const expiresAt = new Date(createdAt).getTime() + 60 * 60 * 1000;
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const id = setInterval(() => {
      const left = getSecondsLeft();
      setSecondsLeft(left);
      if (left === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  return secondsLeft;
}

function CancellationTimer({ createdAt, withdrawalId, onCancel, isCancelling }: {
  createdAt: string;
  withdrawalId: string;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}) {
  const secondsLeft = useCancellationCountdown(createdAt);

  if (secondsLeft === 0) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/5">
        <Clock className="h-3 w-3 text-white/20" />
        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Expirado</span>
      </div>
    );
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-400/5 border border-yellow-400/10">
        <Clock className="h-3 w-3 text-yellow-400/60" />
        <span className="text-[9px] font-black text-yellow-400/80 tabular-nums tracking-widest">{mins}:{secs}</span>
      </div>
      <button
        onClick={() => onCancel(withdrawalId)}
        disabled={isCancelling}
        className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/10 hover:border-red-500 disabled:opacity-20 group/btn"
      >
        <X className={`h-4 w-4 transition-transform ${isCancelling ? 'animate-spin' : 'group-hover/btn:scale-110'}`} />
      </button>
    </div>
  );
}

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

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// Explorer URL by currency (best-effort — adjust to preferred explorer)
function explorerUrl(currency: string, hash: string): string | null {
  const map: Record<string, string> = {
    BTC:  `https://blockstream.info/tx/${hash}`,
    ETH:  `https://etherscan.io/tx/${hash}`,
    USDT: `https://etherscan.io/tx/${hash}`,
  };
  return map[currency.toUpperCase()] ?? null;
}

function WithdrawalDetailPanel({ w }: { w: WithdrawalRequest }) {
  const hashCopy = useCopy(w.tx_hash ?? '');
  const addrCopy = useCopy(w.destination_address);
  const explorer = w.tx_hash ? explorerUrl(w.currency, w.tx_hash) : null;

  const sentAt = w.status === 'completed'
    ? new Date(w.updated_at)
    : null;

  return (
    <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Tx hash */}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/40 flex items-center gap-1.5">
          <Hash className="w-3 h-3" /> Hash de Transacción
        </p>
        {w.tx_hash ? (
          <div className="flex items-center gap-2">
            <code className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/5 px-3 py-2 rounded-xl flex-1 truncate">
              {w.tx_hash}
            </code>
            <button onClick={hashCopy.copy} className="p-2 bg-white/5 hover:bg-nexus-blue/20 border border-white/5 rounded-xl transition-all shrink-0">
              {hashCopy.copied
                ? <Check className="w-3.5 h-3.5 text-green-400" />
                : <Copy className="w-3.5 h-3.5 text-white/30" />}
            </button>
            {explorer && (
              <a href={explorer} target="_blank" rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-nexus-blue/20 border border-white/5 rounded-xl transition-all shrink-0">
                <ExternalLink className="w-3.5 h-3.5 text-white/30" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Pendiente de asignación</p>
        )}
      </div>

      {/* Execution time */}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/40">Fecha y Hora de Envío</p>
        {sentAt ? (
          <div>
            <p className="text-sm font-black text-white tracking-tighter">
              {sentAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </p>
            <p className="text-[10px] font-black text-white/30 tracking-widest">
              {sentAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        ) : (
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No ejecutado aún</p>
        )}
      </div>

      {/* Full address */}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/40">Dirección Completa</p>
        <div className="flex items-center gap-2">
          <code className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/5 px-3 py-2 rounded-xl flex-1 break-all">
            {w.destination_address}
          </code>
          <button onClick={addrCopy.copy} className="p-2 bg-white/5 hover:bg-nexus-blue/20 border border-white/5 rounded-xl transition-all shrink-0">
            {addrCopy.copied
              ? <Check className="w-3.5 h-3.5 text-green-400" />
              : <Copy className="w-3.5 h-3.5 text-white/30" />}
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/40">Desglose de Montos</p>
        <div className="space-y-1.5 text-[10px] font-black">
          <div className="flex justify-between">
            <span className="text-white/30 uppercase tracking-widest">Bruto solicitado</span>
            <span className="text-white">${formatCurrency(w.amount)} {w.currency}</span>
          </div>
          {w.fee_amount && parseFloat(w.fee_amount) > 0 && (
            <div className="flex justify-between">
              <span className="text-amber-400/60 uppercase tracking-widest">FEE DE INFRAESTRUCTURA ({Number(w.commission_rate).toLocaleString('en-US', { maximumFractionDigits: 2 })}%)</span>
              <span className="text-amber-400/80">-${formatCurrency(w.fee_amount)}</span>
            </div>
          )}
          {w.net_amount && (
            <div className="flex justify-between border-t border-white/5 pt-1.5">
              <span className="text-white/60 uppercase tracking-widest">Neto recibido</span>
              <span className="text-nexus-blue-light">${formatCurrency(w.net_amount)} {w.currency}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rejection/cancellation reason */}
      {(w.status === 'rejected' || w.status === 'cancelled') && w.rejection_reason && (
        <div className="md:col-span-2 flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-red-400/60 mb-1">
              {w.status === 'cancelled' ? 'Motivo de cancelación' : 'Motivo de rechazo'}
            </p>
            <p className="text-[10px] font-black text-red-400/80">{w.rejection_reason}</p>
          </div>
        </div>
      )}

      {/* Admin reviewer */}
      {w.reviewed_by_name && (
        <div className="md:col-span-2 flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="w-6 h-6 rounded-lg bg-nexus-blue/10 border border-nexus-blue/20 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-black text-nexus-blue-light">AD</span>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-0.5">
              {w.status === 'rejected' ? 'Rechazado por' : w.status === 'completed' ? 'Confirmado por' : 'Revisado por'}
            </p>
            <p className="text-[10px] font-black text-white/60">{w.reviewed_by_name}</p>
          </div>
          {w.reviewed_at && (
            <p className="ml-auto text-[9px] font-black text-white/20 uppercase tracking-widest">
              {new Date(w.reviewed_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              {' · '}
              {new Date(w.reviewed_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function WithdrawalHistory() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
                {['Registro', 'Liquidación', 'Protocolo', 'Dirección Wallet', 'Estatus', '', ''].map((header) => (
                  <th key={header} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center opacity-20">
                    <p className="text-xs font-black uppercase tracking-[0.5em]">Sin registros de liquidación activos</p>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => {
                  const { date, time } = formatDate(w.created_at);
                  const status = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.pending;
                  const isThisCancelling = cancellingId === w.id && isCancelling;
                  const isExpanded = expandedId === w.id;
                  const hasHash = !!w.tx_hash;

                  return (
                    <>
                      <tr
                        key={w.id}
                        onClick={() => setExpandedId(isExpanded ? null : w.id)}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-white/5 group"
                      >
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
                          <div className="flex flex-col gap-1">
                            <code className="text-[10px] font-black font-mono text-white/40 tracking-tighter bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              {truncateAddress(w.destination_address)}
                            </code>
                            {hasHash && (
                              <span className="text-[8px] font-black text-nexus-blue-light/50 uppercase tracking-widest flex items-center gap-1">
                                <Hash className="w-2.5 h-2.5" /> TX hash disponible
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${status.classes}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                          {w.status === 'pending' && (
                            <CancellationTimer
                              createdAt={w.created_at}
                              withdrawalId={w.id}
                              onCancel={handleCancel}
                              isCancelling={isThisCancelling}
                            />
                          )}
                        </td>
                        <td className="pr-6 py-6 text-right">
                          <ChevronDown className={`w-4 h-4 text-white/20 group-hover:text-white/40 transition-all ${isExpanded ? 'rotate-180 text-nexus-blue-light/60' : ''}`} />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${w.id}-detail`} className="border-b border-white/5">
                          <td colSpan={7} className="p-0">
                            <WithdrawalDetailPanel w={w} />
                          </td>
                        </tr>
                      )}
                    </>
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


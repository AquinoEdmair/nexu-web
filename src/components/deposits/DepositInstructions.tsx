'use client';

import { useState } from 'react';
import { Copy, Check, Loader2, Send, QrCode } from 'lucide-react';
import { useConfirmDeposit } from '@/lib/hooks/useConfirmDeposit';
import { useNotificationStore } from '@/lib/store/notificationStore';
import type { DepositRequest } from '@/types/models';
import { AxiosError } from 'axios';

interface DepositInstructionsProps {
  deposit: DepositRequest;
  onUpdated: (updated: DepositRequest) => void;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente de pago',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    dot: 'bg-amber-400',
  },
  client_confirmed: {
    label: 'En revisión',
    badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    dot: 'bg-blue-400 animate-pulse',
  },
  completed: {
    label: 'Completado',
    badge: 'bg-nexus-blue/10 border-nexus-blue/30 text-nexus-blue-light',
    dot: 'bg-nexus-blue-light',
  },
  cancelled: {
    label: 'Cancelado',
    badge: 'bg-red-500/10 border-red-500/30 text-red-400',
    dot: 'bg-red-400',
  },
};

export function DepositInstructions({ deposit, onUpdated }: DepositInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [showConfirmForm, setShowConfirmForm] = useState(false);

  const { mutate: confirm, isPending } = useConfirmDeposit();
  const { addNotification } = useNotificationStore();

  const statusCfg = STATUS_CONFIG[deposit.status] ?? STATUS_CONFIG.pending;

  const handleCopy = () => {
    navigator.clipboard.writeText(deposit.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (txHash.trim().length < 8) return;
    confirm(
      { id: deposit.id, tx_hash: txHash.trim() },
      {
        onSuccess: (res) => {
          addNotification({ type: 'success', title: 'Pago confirmado', message: 'Tu pago está en revisión por el equipo.' });
          onUpdated(res.data);
          setShowConfirmForm(false);
          setTxHash('');
        },
        onError: (err) => {
          const message = err instanceof AxiosError
            ? err.response?.data?.message ?? 'Error al confirmar.'
            : 'Error inesperado.';
          addNotification({ type: 'error', title: 'Error', message });
        },
      },
    );
  };

  return (
    <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Solicitud #{deposit.id.substring(0, 8).toUpperCase()}</p>
          <p className="text-sm font-black text-white uppercase tracking-tight mt-0.5">
            ${parseFloat(deposit.amount_expected).toFixed(2)} <span className="text-nexus-blue-light">{deposit.currency}</span>
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${statusCfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
      </div>

      <div className="p-8 space-y-6">
        {/* QR */}
        {deposit.qr_image_url && (
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl inline-block">
              <img src={deposit.qr_image_url} alt="QR depósito" className="h-40 w-40 object-contain" />
            </div>
          </div>
        )}

        {!deposit.qr_image_url && (
          <div className="flex justify-center py-6">
            <QrCode className="w-16 h-16 text-white/10" />
          </div>
        )}

        {/* Network */}
        {deposit.network && (
          <div className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/20 text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">
              Red: {deposit.network}
            </span>
          </div>
        )}

        {/* Address */}
        <div className="space-y-2">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Dirección de depósito</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <p className="flex-1 font-mono text-xs text-white/80 break-all">{deposit.address}</p>
            <button
              onClick={handleCopy}
              className="shrink-0 p-2 rounded-xl bg-white/5 hover:bg-nexus-blue/20 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-nexus-blue-light" /> : <Copy className="w-4 h-4 text-white/40" />}
            </button>
          </div>
        </div>

        {/* Monto y Comisión */}
        <div className="space-y-3 p-5 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Se acreditará a tu cuenta</span>
            <span className="text-sm font-black text-white">
              ${parseFloat(deposit.net_amount || deposit.amount_expected).toFixed(2)} USD
            </span>
          </div>
          {parseFloat(deposit.fee_amount || '0') > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                FEE DE INFRAESTRUCTURA ({deposit.commission_rate}%)
              </span>
              <span className="text-xs font-black text-amber-400">
                +${parseFloat(deposit.fee_amount || '0').toFixed(2)} USD
              </span>
            </div>
          )}
          <div className="h-px bg-white/10 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Monto exacto a enviar</span>
            <span className="text-nexus-blue-light font-black text-lg">
              ${parseFloat(deposit.amount_expected).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Confirmar pago — solo visible en pending */}
        {deposit.status === 'pending' && (
          <div className="pt-2 space-y-3">
            {!showConfirmForm ? (
              <button
                onClick={() => setShowConfirmForm(true)}
                className="w-full py-4 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
              >
                <Send className="h-4 w-4" /> Ya realicé el pago
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Hash / ID de transacción</p>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Pega aquí el hash de tu transacción..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-mono text-sm outline-none focus:border-nexus-blue/50 transition-all placeholder:text-white/10"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowConfirmForm(false); setTxHash(''); }}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white/40 font-black rounded-2xl hover:text-white transition-all text-xs uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isPending || txHash.trim().length < 8}
                    className="flex-1 py-3 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all flex items-center justify-center gap-2 disabled:opacity-30 text-xs uppercase tracking-widest"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirmar</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado client_confirmed */}
        {deposit.status === 'client_confirmed' && (
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
            <div className="p-5 pl-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em]">Pago en revisión</p>
              </div>
              <p className="text-[11px] text-blue-300/70 font-bold leading-relaxed">
                Le indicamos que en un máximo de <span className="text-blue-300 font-black">24 horas laborales</span> su pago será confirmado y los fondos agregados a su capital en operación.
              </p>
              <p className="text-[11px] text-blue-300/70 font-bold leading-relaxed">
                Si tiene dudas o consultas adicionales, contáctenos a través de{' '}
                <span className="text-blue-300 font-black">Soporte</span> con el ID de la transacción:
              </p>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[9px] text-white/30 font-black uppercase tracking-widest shrink-0">ID:</span>
                <span className="font-mono text-[10px] text-white/60 break-all">{deposit.id}</span>
              </div>
              {deposit.tx_hash && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest shrink-0">TX:</span>
                  <span className="font-mono text-[10px] text-white/60 break-all">{deposit.tx_hash}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado completed */}
        {deposit.status === 'completed' && (
          <div className="p-4 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl">
            <p className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">Depósito acreditado ✓</p>
            {deposit.reviewed_by_name && (
              <p className="text-[10px] text-white/20 font-bold mt-1">Revisado por {deposit.reviewed_by_name}</p>
            )}
          </div>
        )}

        {/* Estado cancelled */}
        {deposit.status === 'cancelled' && (
          <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Depósito cancelado</p>
            {deposit.rejection_reason && (
              <p className="text-[10px] text-red-400/60 font-bold mt-1">{deposit.rejection_reason}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

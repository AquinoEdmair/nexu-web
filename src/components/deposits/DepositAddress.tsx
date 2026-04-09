'use client';

import { useState, useEffect } from 'react';
import { DepositInvoice } from '@/types/models';
import { Copy, Check, CheckCircle, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';

interface DepositAddressProps {
  invoice: DepositInvoice;
}

function useCountdown(expiresAt: string) {
  const [remaining, setRemaining] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    const secs = tick();
    setRemaining(secs);
    if (secs <= 0) return;

    const timer = setInterval(() => {
      const s = tick();
      setRemaining(s);
      if (s <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return { remaining, formatted: `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s` };
}

export function DepositAddress({ invoice }: DepositAddressProps) {
  const [copied, setCopied] = useState(false);
  const { remaining, formatted } = useCountdown(invoice.expires_at);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invoice.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = remaining <= 0;

  if (invoice.status === 'completed') {
    return (
      <div className="bg-nexus-blue/5 border border-nexus-blue/20 rounded-3xl p-10 animate-in fade-in zoom-in duration-500 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-nexus-blue/5 animate-pulse opacity-20"></div>
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="h-24 w-24 bg-nexus-blue/10 rounded-full flex items-center justify-center border border-nexus-blue/20 shadow-[0_0_30px_rgba(11,64,193,0.2)]">
            <ShieldCheck className="h-12 w-12 text-nexus-blue-light" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Fondeo Sincronizado</h3>
            <p className="text-nexus-text/40 font-medium max-w-[300px] leading-relaxed">
              El capital ha sido validado e integrado bajo el protocolo de seguridad de buevada.
            </p>
          </div>
          <div className="w-full p-5 bg-[#0a0f16]/40 border border-white/5 rounded-2xl">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[10px] font-black text-nexus-blue-light/60 uppercase tracking-[0.2em]">Carga Finalizada</span>
              <span className="text-white font-black text-lg">{invoice.amount_received ?? invoice.amount_expected} <span className="text-xs opacity-40">{invoice.currency}</span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center space-y-6 grayscale opacity-40">
          <AlertTriangle className="h-12 w-12 text-red-400" />
          <div>
            <p className="text-white font-black uppercase tracking-widest text-lg">Dirección Expirada</p>
            <p className="text-xs text-nexus-text/40 mt-2 uppercase tracking-tight">El nodo de recepción ha sido desconectado por inactividad.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] relative border-b-nexus-blue/30 border-b-2">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Live Status Indicator */}
        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
          <Radio className="w-3 h-3 text-nexus-blue-light animate-pulse" />
          <span className="text-[9px] font-black text-nexus-blue-light uppercase tracking-[0.2em]">Nodo de Recepción Activo</span>
        </div>

        {/* QR Code */}
        {(invoice.qr_code_url || true) && (
          <div className="p-5 bg-white rounded-3xl shadow-[0_0_40px_rgba(24,136,243,0.1)] group relative transition-transform hover:scale-105 duration-500">
            <img
              src={invoice.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invoice.currency + ':' + invoice.address)}`}
              alt={`Código QR para depósito de ${invoice.currency}`}
              className="w-44 h-44"
            />
            <div className="absolute inset-0 border-[3px] border-nexus-blue opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity animate-pulse"></div>
          </div>
        )}

        {/* Address Entry */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/60">
              Dirección para Transferencia ({invoice.network ?? 'NETWORK'})
            </label>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-nexus-blue/20 transition-all">
            <code className="text-xs font-black font-mono text-white/40 break-all flex-1 text-left tracking-tighter">
              {invoice.address}
            </code>
            <button
              onClick={handleCopy}
              className="text-nexus-blue-light hover:text-white transition-all shrink-0 border-none bg-transparent"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="w-full pt-4 flex flex-col items-center gap-5">
           <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-2 text-[10px] text-white/20 font-black uppercase tracking-widest">
                <Clock className="w-3 h-3 text-nexus-blue-light" />
                Vida del Nodo
              </div>
              <span className="text-sm font-black text-nexus-blue-light font-mono tracking-widest">{formatted}</span>
           </div>

          <div className="p-5 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl w-full">
            <p className="text-[10px] text-yellow-400/60 font-black text-center leading-relaxed uppercase tracking-tighter">
              Aviso: Transfiere únicamente {invoice.currency} 
              {invoice.network ? ` vía ${invoice.network}` : ''}. 
              Cualquier otro activo resultará en pérdida definitiva de capital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


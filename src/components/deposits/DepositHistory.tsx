'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { depositsApi } from '@/lib/api/deposits';
import { formatCurrency } from '@/lib/utils/format';

import { Modal } from '@/components/ui/Modal';
import { DepositAddress } from '@/components/deposits/DepositAddress';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { Copy, Check, Clock, CheckCircle2, XCircle, Eye, Activity, Database, UserCheck } from 'lucide-react';
import { DepositInvoice } from '@/types/models';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  completed:        { label: 'Sincronizado', icon: CheckCircle2, classes: 'text-nexus-blue-light bg-nexus-blue/10 border-nexus-blue/20 shadow-[0_0_12px_rgba(11,64,193,0.1)]' },
  awaiting_payment: { label: 'Esperando Pago',  icon: Clock,        classes: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_12px_rgba(250,204,21,0.1)]' },
  expired:          { label: 'Expirado',   icon: XCircle,      classes: 'text-white/20 bg-white/5 border-white/10 shadow-none grayscale' },
};

function RowCountdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) return 'EXPIRADO';
      
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    setTimeLeft(calculate());
    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-[9px] font-black font-mono text-yellow-400/80 ml-2 tracking-widest">{timeLeft}</span>;
}

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('es', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    time: d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function DepositHistory() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<DepositInvoice | null>(null);
  const addNotification = useNotificationStore(s => s.addNotification);
  const prevInvoicesRef = useRef<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['deposits', 'invoices'],
    queryFn: () => depositsApi.getInvoiceHistory(),
    refetchInterval: 8000,
  });

  const invoices = data?.data ?? [];

  useEffect(() => {
    if (invoices.length > 0) {
      invoices.forEach(inv => {
        const prevStatus = prevInvoicesRef.current[inv.invoice_id];
        if (prevStatus === 'awaiting_payment' && inv.status === 'completed') {
          addNotification({
            type: 'success',
            title: 'Nodo Confirmado',
            message: `Recepción de ${inv.amount_received ?? inv.amount_expected} ${inv.currency} validada exitosamente.`,
            duration: 8000
          });
        }
        prevInvoicesRef.current[inv.invoice_id] = inv.status;
      });
    }
  }, [invoices, addNotification]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0f16]/40 border border-white/5 rounded-3xl p-10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[400px]">
        <Activity className="w-10 h-10 text-nexus-blue-light animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-nexus-blue-light/40">Sincronizando Ledger de Red...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-nexus-blue-light" />
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Log de Operaciones</h2>
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
                {['Registro', 'Activo', 'Protocolo', 'Nodo de Recepción', 'Origen', 'Estatus', ''].map((header) => (
                  <th key={header} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center opacity-20">
                    <p className="text-xs font-black uppercase tracking-[0.5em]">Sin registros tácticos activos</p>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const { date, time } = formatDate(invoice.created_at);
                  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.expired;
                  const Icon = status.icon;

                  return (
                    <tr key={invoice.invoice_id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white tracking-tighter">{date}</span>
                          <span className="text-[10px] text-white/20 font-black tracking-widest">{time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-nexus-blue-light">{invoice.currency}</span>
                          {invoice.network && (
                            <span className="inline-block px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-[8px] text-white/40 font-black tracking-widest uppercase w-fit">
                              {invoice.network}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-white tracking-tight">
                            ${formatCurrency(invoice.amount_expected)} <span className="text-[10px] text-white/20">USD</span>
                          </span>
                          {invoice.pay_amount && (
                            <span className="text-[10px] font-black font-mono text-nexus-blue-light/60">
                              {formatCurrency(invoice.pay_amount)} {invoice.currency}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 transition-all group-hover:border-nexus-blue/20 max-w-[200px]">
                          <code className="text-[10px] font-black font-mono text-white/40 truncate flex-1 tracking-tighter">
                            {invoice.address}
                          </code>
                          <button
                            onClick={() => handleCopy(invoice.address, invoice.invoice_id)}
                            className="text-nexus-blue-light/40 hover:text-nexus-blue-light transition-all border-none bg-transparent"
                          >
                            {copiedId === invoice.invoice_id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {invoice.confirmed_manually ? (
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-400/20 bg-amber-400/10 text-amber-400 text-[9px] font-black uppercase tracking-widest w-fit">
                              <UserCheck className="h-3 w-3" />
                              Admin
                            </div>
                            {invoice.confirmed_by_name && (
                              <span className="text-[9px] text-white/30 font-black tracking-widest truncate max-w-[120px]">
                                {invoice.confirmed_by_name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Automático</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.classes}`}>
                          <Icon className="h-3 w-3" />
                          <span className="flex items-center">
                            {status.label}
                            {invoice.status === 'awaiting_payment' && <RowCountdown expiresAt={invoice.expires_at} />}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-3 bg-white/5 hover:bg-nexus-blue rounded-xl text-nexus-blue-light hover:text-white transition-all border border-white/5 hover:border-nexus-blue shadow-inner group/btn"
                        >
                          <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)}
        title="Protocolo de Transferencia"
        description="Escanea el código QR o utiliza el nodo de recepción para finalizar el fondeo."
      >
        {selectedInvoice && <DepositAddress invoice={selectedInvoice} />}
      </Modal>
    </div>
  );
}

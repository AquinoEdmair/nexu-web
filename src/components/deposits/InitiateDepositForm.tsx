'use client';

import { useState, useEffect, useRef } from 'react';
import { useInitiateDeposit } from '@/lib/hooks/useInitiateDeposit';
import { usePendingInvoices } from '@/lib/hooks/usePendingInvoices';
import { SUPPORTED_CURRENCIES } from '@/lib/validators/deposit';
import { DepositInvoice } from '@/types/models';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { DollarSign, Bitcoin, RefreshCcw, ArrowRight, Loader2, Info, Zap } from 'lucide-react';
import { AxiosError } from 'axios';

const CURRENCY_CONFIG = {
  USDT: { icon: DollarSign, label: 'USDT' },
  BTC:  { icon: Bitcoin,    label: 'BTC' },
  ETH:  { icon: RefreshCcw, label: 'ETH' },
} as const;

interface InitiateDepositFormProps {
  invoice: DepositInvoice | null;
  setInvoice: (invoice: DepositInvoice | null) => void;
}

export function InitiateDepositForm({ invoice, setInvoice }: InitiateDepositFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<typeof SUPPORTED_CURRENCIES[number]>('USDT');
  const [amount, setAmount] = useState<string>('');
  const { data: pendingData, isLoading: isLoadingPending } = usePendingInvoices();
  const { mutate, isPending, error, reset } = useInitiateDeposit();
  const addNotification = useNotificationStore(s => s.addNotification);

  const lastAutoLoadedId = useRef<string | null>(null);

  useEffect(() => {
    if (pendingData?.data && pendingData.data.length > 0 && !isPending) {
      const activePending = pendingData.data.find(inv => inv.status === 'awaiting_payment');
      const currentInData = invoice ? pendingData.data.find(inv => inv.invoice_id === invoice.invoice_id) : null;

      if (currentInData && currentInData.status !== invoice?.status) {
        setInvoice(currentInData);
      }

      if (activePending && !invoice && lastAutoLoadedId.current !== activePending.invoice_id) {
        setInvoice(activePending);
        setSelectedCurrency(activePending.currency as any);
        lastAutoLoadedId.current = activePending.invoice_id;
      }
    }
  }, [pendingData, invoice, isPending, setInvoice]);

  const handleGenerate = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 10) return;
    
    reset();
    mutate({
      currency: selectedCurrency, 
      amount: numericAmount 
    }, {
      onSuccess: (data) => {
        setInvoice(data.data);
        addNotification({
          type: 'success',
          title: 'Protocolo Iniciado',
          message: `Dirección de ${selectedCurrency} generada bajo cifrado HMAC.`,
          duration: 5000
        });
      },
    });
  };

  const handleSelectCurrency = (currency: typeof SUPPORTED_CURRENCIES[number]) => {
    setSelectedCurrency(currency);
    if (invoice && invoice.status === 'awaiting_payment') {
      lastAutoLoadedId.current = invoice.invoice_id;
    }
    setInvoice(null);
    reset();
  };

  const errorMessage = error instanceof AxiosError
    ? error.response?.data?.message ?? 'Fallo en la generación del nodo. Reintenta.'
    : error ? 'Error de protocolo inesperado.' : null;

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-8">
        {/* Currency Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-nexus-blue-light" />
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/60">
              Activo de Transferencia
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SUPPORTED_CURRENCIES.map((currency) => {
              const config = CURRENCY_CONFIG[currency];
              const Icon = config.icon;
              const isSelected = selectedCurrency === currency;

              return (
                <button
                  key={currency}
                  onClick={() => handleSelectCurrency(currency)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border outline-none ${
                    isSelected
                      ? 'bg-nexus-blue/10 border-nexus-blue/30 text-nexus-blue-light shadow-[0_0_15px_rgba(11,64,193,0.1)]'
                      : 'bg-white/5 border-white/5 text-nexus-text/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'animate-pulse' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Monto Requerido (USD)
            </label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-nexus-blue-light group-focus-within:text-white transition-colors">
              <span className="font-black">$</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0a0f16]/40 border border-white/10 rounded-2xl py-5 pl-10 pr-6 text-white font-black text-xl outline-none focus:border-nexus-blue/50 focus:bg-white/5 transition-all placeholder:text-white/10"
            />
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-nexus-text/40 px-1 uppercase tracking-widest">
            <Info className="h-3 w-3" />
            <span>Umbral mínimo de adquisición: $10.00 USD</span>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <Info className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-400 font-black uppercase leading-relaxed tracking-tight">{errorMessage}</p>
          </div>
        )}

        {/* Command Button */}
        <button
          onClick={handleGenerate}
          disabled={isPending || !amount || parseFloat(amount) < 10}
          className="w-full bg-nexus-blue text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-nexus-blue-light disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(11,64,193,0.2)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Iniciar Adquisición
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}


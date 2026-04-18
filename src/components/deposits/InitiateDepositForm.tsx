'use client';

import { useState, useEffect, useRef } from 'react';
import { useInitiateDeposit } from '@/lib/hooks/useInitiateDeposit';
import { usePendingInvoices } from '@/lib/hooks/usePendingInvoices';
import { useCurrencies } from '@/lib/hooks/useCurrencies';
import { DepositInvoice } from '@/types/models';
import { formatCurrency } from '@/lib/utils/format';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { ArrowRight, Loader2, Info, Zap, TrendingUp, Shield, Search, ChevronDown, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';

interface CommissionPreview {
  rate: number;
  net_amount: number;
  fee_amount: number;
  amount_charged: number;
}

interface InitiateDepositFormProps {
  invoice: DepositInvoice | null;
  setInvoice: (invoice: DepositInvoice | null) => void;
}

export function InitiateDepositForm({ invoice, setInvoice }: InitiateDepositFormProps) {
  const { data: currencies = [], isLoading: isLoadingCurrencies } = useCurrencies();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: pendingData } = usePendingInvoices();
  const { mutate, isPending, error, reset } = useInitiateDeposit();
  const addNotification = useNotificationStore(s => s.addNotification);
  const lastAutoLoadedId = useRef<string | null>(null);

  // Auto-select first currency once loaded
  useEffect(() => {
    if (currencies.length > 0 && !invoice) {
      setSelectedCurrency(prev => currencies.some(c => c.symbol === prev) ? prev : currencies[0].symbol);
    }
  }, [currencies, invoice]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  const numericAmount = parseFloat(amount) || 0;

  const { data: commissionData } = useQuery<{ data: CommissionPreview }>({
    queryKey: ['deposit-commission', numericAmount],
    queryFn: () => apiClient.get(`/deposits/commission-rate?amount=${numericAmount}`).then(r => r.data),
    enabled: numericAmount >= 10,
    staleTime: 30_000,
  });

  const preview = commissionData?.data;

  useEffect(() => {
    if (pendingData?.data && pendingData.data.length > 0 && !isPending) {
      const activePending = pendingData.data.find(inv => inv.status === 'awaiting_payment');
      const currentInData = invoice ? pendingData.data.find(inv => inv.invoice_id === invoice.invoice_id) : null;

      if (currentInData && currentInData.status !== invoice?.status) {
        setInvoice(currentInData);
      }

      if (activePending && !invoice && lastAutoLoadedId.current !== activePending.invoice_id) {
        setInvoice(activePending);
        setSelectedCurrency(activePending.currency as string);
        lastAutoLoadedId.current = activePending.invoice_id;
      }
    }
  }, [pendingData, invoice, isPending, setInvoice]);

  const handleGenerate = () => {
    if (!numericAmount || numericAmount < 10) return;
    reset();
    mutate({ currency: selectedCurrency, amount: numericAmount }, {
      onSuccess: (data) => {
        setInvoice(data.data);
        addNotification({
          type: 'success',
          title: 'Dirección Generada',
          message: `Dirección de ${selectedCurrency} lista. Envía el monto exacto.`,
          duration: 5000
        });
      },
    });
  };

  const handleSelectCurrency = (symbol: string) => {
    setSelectedCurrency(symbol);
    if (invoice && invoice.status === 'awaiting_payment') {
      lastAutoLoadedId.current = invoice.invoice_id;
    }
    setInvoice(null);
    reset();
    setIsOpen(false);
    setSearch('');
  };

  const errorMessage = error instanceof AxiosError
    ? error.response?.data?.message ?? 'Error al generar la dirección. Reintenta.'
    : error ? 'Error inesperado. Reintenta.' : null;

  const hasCommission = preview && preview.rate > 0 && numericAmount >= 10;

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);

  const filtered = currencies.filter(c => {
    const q = search.toLowerCase();
    return c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (c.network ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-8">
        {/* Currency Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-nexus-blue-light" />
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/60">
              Activo de Inversión
            </label>
          </div>

          {isLoadingCurrencies ? (
            <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setIsOpen(v => !v)}
                className="w-full bg-[#0a0f16]/60 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-left text-white font-black text-sm outline-none focus:border-nexus-blue/50 transition-all hover:border-white/20"
              >
                {selectedCurrencyData
                  ? <span>{selectedCurrencyData.symbol}{selectedCurrencyData.network ? <span className="text-white/30 font-medium"> — {selectedCurrencyData.network}</span> : ''} <span className="text-white/30 font-medium">· {selectedCurrencyData.name}</span></span>
                  : <span className="text-white/30">Selecciona una moneda</span>
                }
              </button>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <ChevronDown className={`w-4 h-4 text-nexus-blue-light/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  {/* Search */}
                  <div className="p-2 border-b border-white/5">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                      <Search className="w-3 h-3 text-white/30 shrink-0" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar moneda..."
                        className="flex-1 bg-transparent text-white text-xs font-black outline-none placeholder:text-white/20 tracking-wide"
                      />
                      {search && (
                        <button onClick={() => setSearch('')} className="text-white/30 hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="max-h-52 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="py-6 text-center text-[10px] text-white/20 font-black uppercase tracking-widest">
                        Sin resultados
                      </div>
                    ) : (
                      filtered.map(c => (
                        <button
                          key={c.symbol}
                          type="button"
                          onClick={() => handleSelectCurrency(c.symbol)}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors hover:bg-white/5 ${
                            selectedCurrency === c.symbol ? 'bg-nexus-blue/10 text-nexus-blue-light' : 'text-white/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black">{c.symbol}</span>
                            {c.network && (
                              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/30">
                                {c.network}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/30 font-medium">{c.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Monto a Invertir (USD)
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
            <span>Mínimo de inversión: $10.00 USD</span>
          </div>
        </div>

        {/* Commission Breakdown */}
        {hasCommission && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400/80">
                Desglose de Inversión
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Recibes en tu cuenta</span>
                <span className="text-[11px] font-black text-white">${formatCurrency(preview.net_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                  Comisión de plataforma ({preview.rate}%)
                </span>
                <span className="text-[11px] font-black text-amber-400">+${formatCurrency(preview.fee_amount)}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Total a enviar</span>
                <span className="text-sm font-black text-nexus-blue-light">${formatCurrency(preview.amount_charged)}</span>
              </div>
            </div>
          </div>
        )}

        {/* No commission notice */}
        {numericAmount >= 10 && preview && preview.rate === 0 && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 animate-in fade-in">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Sin comisión activa — recibes el 100% de ${formatCurrency(numericAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <Info className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-400 font-black uppercase leading-relaxed tracking-tight">{errorMessage}</p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isPending || !amount || numericAmount < 10}
          className="w-full bg-nexus-blue text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-nexus-blue-light disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(11,64,193,0.2)] active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {hasCommission ? `Generar Dirección — Enviar $${formatCurrency(preview.amount_charged)}` : 'Generar Dirección de Pago'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Loader2, Wallet, ArrowRight, ShieldAlert } from 'lucide-react';
import { useDepositCurrencies } from '@/lib/hooks/useDepositCurrencies';
import { useCreateDeposit } from '@/lib/hooks/useCreateDeposit';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { useBalance } from '@/lib/hooks/useBalance';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import type { DepositRequest } from '@/types/models';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';

interface CommissionPreview {
  rate: number;
  net_amount: number;
  fee_amount: number;
  amount_charged: number;
}

interface DepositFormProps {
  onCreated: (deposit: DepositRequest) => void;
}

export function DepositForm({ onCreated }: DepositFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');

  const { data: currenciesRes, isLoading: currenciesLoading } = useDepositCurrencies();
  const { data: balanceData } = useBalance();
  const { mutate, isPending, reset } = useCreateDeposit();
  const { addNotification } = useNotificationStore();

  const currencies = currenciesRes?.data ?? [];
  const minimum    = currenciesRes?.minimum_deposit_amount ?? 0;

  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0].symbol);
    }
  }, [currencies, selectedCurrency]);

  const numericAmount  = parseFloat(amount) || 0;
  const belowMinimum   = minimum > 0 && numericAmount > 0 && numericAmount < minimum;
  const isValid        = numericAmount > 0 && !!selectedCurrency && !belowMinimum;

  const { data: commissionData } = useQuery<{ data: CommissionPreview }>({
    queryKey: ['deposit-commission', numericAmount],
    queryFn: () => apiClient.get(`/deposits/commission-rate?amount=${numericAmount}`).then(r => r.data),
    enabled: isValid,
    staleTime: 30_000,
  });

  const preview = commissionData?.data;
  const hasCommission = preview && preview.rate > 0 && isValid;

  const handleSubmit = () => {
    if (!isValid) return;
    reset();
    mutate(
      { currency: selectedCurrency, amount: numericAmount },
      {
        onSuccess: (res) => {
          addNotification({ type: 'success', title: 'Solicitud creada', message: `Depósito de $${numericAmount} ${selectedCurrency} registrado.` });
          setAmount('');
          onCreated(res.data);
        },
        onError: (err) => {
          const message = err instanceof AxiosError
            ? err.response?.data?.message ?? 'Error al crear solicitud.'
            : 'Error inesperado.';
          addNotification({ type: 'error', title: 'Error', message });
        },
      },
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Balance */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-nexus-blue/10 rounded-xl border border-nexus-blue/20">
          <Wallet className="h-4 w-4 text-nexus-blue-light" />
        </div>
        <div>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Saldo en operación</p>
          <FormattedAmount amount={balanceData?.data?.balance_in_operation ?? '0'} className="text-lg" />
        </div>
      </div>

      {/* Currency selector */}
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Moneda</label>
        {currenciesLoading ? (
          <div className="flex items-center gap-2 text-white/20">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Cargando...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {currencies.map((c) => (
              <button
                key={c.symbol}
                onClick={() => setSelectedCurrency(c.symbol)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCurrency === c.symbol
                    ? 'bg-nexus-blue text-white shadow-[0_0_12px_rgba(11,64,193,0.3)]'
                    : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                {c.symbol}
                {c.network && <span className="text-[8px] opacity-60">({c.network})</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
            Monto a depositar (USD)
          </span>
          {minimum > 0 && (
            <span className="text-[9px] font-black text-amber-400/70 uppercase tracking-widest">
              Mín. ${minimum.toFixed(2)}
            </span>
          )}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-5 flex items-center font-black text-lg text-nexus-blue-light pointer-events-none">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={minimum > 0 ? minimum.toFixed(2) : '0.00'}
            className={`w-full bg-white/5 border rounded-2xl py-4 pl-10 pr-5 text-white font-black text-xl outline-none transition-all placeholder:text-white/10 ${
              belowMinimum
                ? 'border-red-500/60 focus:border-red-500 bg-red-500/5'
                : 'border-white/10 focus:border-nexus-blue/50 focus:bg-white/[0.08]'
            }`}
          />
        </div>
        {belowMinimum && (
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
            El mínimo de depósito es ${minimum.toFixed(2)} USD
          </p>
        )}
      </div>

      {/* Warning */}
      <div className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-tight leading-relaxed">
          Atención: Envíe exclusivamente el monto asignado. El envío de montos diferentes conlleva procesos extendidos de verificación y ajustes técnicos que retrasarán la disponibilidad de sus fondos.
        </p>
      </div>

      {/* Breakdown */}
      {hasCommission && (
        <div className="space-y-3 p-5 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl animate-in fade-in">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Se acreditará a tu cuenta</span>
            <span className="text-sm font-black text-white">
              ${preview.net_amount.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">
              FEE DE INFRAESTRUCTURA ({preview.rate}%)
            </span>
            <span className="text-xs font-black text-amber-400">
              +${preview.fee_amount.toFixed(2)} USD
            </span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Monto exacto a enviar</span>
            <span className="text-nexus-blue-light font-black text-lg">
              ${preview.amount_charged.toFixed(2)} USD
            </span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isPending || !isValid}
        className="w-full py-4 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(11,64,193,0.2)]"
      >
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Creando solicitud...</>
        ) : (
          <>Solicitar depósito <ArrowRight className="h-4 w-4" /></>
        )}
      </button>
    </div>
  );
}

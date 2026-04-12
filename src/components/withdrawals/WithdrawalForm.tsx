'use client';

import { useState } from 'react';
import { useBalance } from '@/lib/hooks/useBalance';
import { useCreateWithdrawal } from '@/lib/hooks/useCreateWithdrawal';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { WITHDRAWAL_CURRENCIES } from '@/lib/validators/withdrawal';
import { formatCurrency } from '@/lib/utils/format';
import { DollarSign, Bitcoin, RefreshCcw, ArrowRight, Loader2, Info, Wallet, Zap, ShieldAlert, TrendingDown } from 'lucide-react';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';

const CURRENCY_CONFIG = {
  USDT: { icon: DollarSign, label: 'USDT' },
  BTC:  { icon: Bitcoin,    label: 'BTC' },
  ETH:  { icon: RefreshCcw, label: 'ETH' },
} as const;

interface WithdrawalPreview {
  rate: number;
  amount: number;
  fee_amount: number;
  net_amount: number;
}

export function WithdrawalForm() {
  const [selectedCurrency, setSelectedCurrency] = useState<typeof WITHDRAWAL_CURRENCIES[number]>('USDT');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const { data: balanceData } = useBalance();
  const { mutate, isPending, reset } = useCreateWithdrawal();
  const { addNotification } = useNotificationStore();

  const balance = balanceData?.data;
  const availableBalance = balance?.balance_available ?? '0';
  const numericAmount = parseFloat(amount) || 0;

  // Fetch commission preview
  const { data: commissionData } = useQuery<{ data: WithdrawalPreview }>({
    queryKey: ['withdrawal-commission', numericAmount],
    queryFn: () => apiClient.get(`/withdrawals/commission-rate?amount=${numericAmount}`).then(r => r.data),
    enabled: numericAmount > 0,
    staleTime: 30_000,
  });

  const preview = commissionData?.data;

  const handleSubmit = () => {
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    if (address.length < 20) return;

    reset();

    mutate(
      {
        amount: numericAmount,
        currency: selectedCurrency,
        destination_address: address,
      },
      {
        onSuccess: () => {
          addNotification({
            type: 'success',
            title: 'Protocolo de Salida Iniciado',
            message: `Solicitud de ${numericAmount} ${selectedCurrency} en proceso de validación.`,
          });
          setAmount('');
          setAddress('');
        },
        onError: (err) => {
          const message = err instanceof AxiosError
            ? err.response?.data?.message ?? 'Error en la ejecución de liquidez.'
            : 'Fallo de protocolo inesperado.';
          
          addNotification({
            type: 'error',
            title: 'Error de Seguridad',
            message,
          });
        }
      },
    );
  };

  const handleMax = () => {
    setAmount(availableBalance);
  };

  const handleSelectCurrency = (currency: typeof WITHDRAWAL_CURRENCIES[number]) => {
    setSelectedCurrency(currency);
    reset();
  };

  const isFormValid = numericAmount > 0 && address.length >= 20 && numericAmount <= parseFloat(availableBalance);
  const hasCommission = preview && preview.rate > 0 && numericAmount > 0;

  return (
    <div className="p-8 space-y-8 bg-[#0a0f16]/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-nexus-blue/10 rounded-2xl border border-nexus-blue/20">
            <Wallet className="h-6 w-6 text-nexus-blue-light" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Ejecución de Liquidez</h2>
            <p className="text-[10px] text-nexus-blue-light/60 font-black uppercase tracking-[0.2em] mt-2">Protocolo de Retiro Activo</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <Zap className="w-3 h-3 text-nexus-blue-light fill-nexus-blue-light" />
          <span className="text-[9px] font-black text-nexus-blue-light uppercase tracking-widest">Revisión HMAC</span>
        </div>
      </div>

      {/* Currency selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Activo de Liquidación
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {WITHDRAWAL_CURRENCIES.map((currency) => {
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

      {/* Amount input */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Monto de Retiro
            </label>
          </div>
          <p className="text-[10px] font-black text-nexus-text/40 uppercase tracking-widest">
            Disponible: <span className="text-nexus-blue-light">${formatCurrency(availableBalance)}</span>
          </p>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-nexus-blue-light group-focus-within:text-white transition-colors">
            <span className="font-black text-lg">$</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#0a0f16]/40 border border-white/10 rounded-2xl py-5 pl-10 pr-16 text-white font-black text-xl outline-none focus:border-nexus-blue/50 focus:bg-white/5 transition-all placeholder:text-white/10"
          />
          <button
            onClick={handleMax}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-nexus-blue-light uppercase tracking-widest px-3 py-1.5 bg-nexus-blue/10 rounded-lg hover:bg-nexus-blue hover:text-white transition-all border border-nexus-blue/20"
          >
            Max
          </button>
        </div>
      </div>

      {/* Commission Breakdown */}
      {hasCommission && (
        <div className="rounded-2xl border border-nexus-blue/20 bg-nexus-blue/5 p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-3 h-3 text-nexus-blue-light" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light/80">
              Desglose de Liquidación
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Monto Solicitado</span>
              <span className="text-[11px] font-black text-white">${preview.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-red-400/80">
              <span className="text-[10px] font-black uppercase tracking-widest">Comisión Retiro ({preview.rate}%)</span>
              <span className="text-[11px] font-black">-${preview.fee_amount.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Neto a Recibir</span>
              <span className="text-lg font-black text-nexus-blue-light">${preview.net_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Destination address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-nexus-blue-light rounded-full"></div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Nodo de Destino ({selectedCurrency})
          </label>
        </div>
        <div className="relative group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-[#0a0f16]/40 border border-white/10 rounded-2xl py-5 px-6 text-white font-black text-sm outline-none focus:border-nexus-blue/50 focus:bg-white/5 transition-all placeholder:text-white/10 tracking-widest font-mono"
          />
        </div>
      </div>

      {/* Info note */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-nexus-blue"></div>
        <ShieldAlert className="h-5 w-5 shrink-0 text-nexus-blue-light mt-0.5" />
        <p className="text-[11px] font-black leading-relaxed text-nexus-text/40 uppercase tracking-tight">
          Sugerencia de Seguridad: Las ejecuciones de liquidez son validadas manualmente bajo protocolo HMAC. Recibirás notificación de red tras la confirmación del bloque.
        </p>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isPending || !isFormValid}
        className="w-full py-5 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light hover:shadow-[0_0_30px_rgba(11,64,193,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            VIGILANDO PROTOCOLO...
          </>
        ) : (
          <>
            {hasCommission ? `Retirar Neto de $${preview.net_amount.toFixed(2)}` : 'Ejecutar Retiro'}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}



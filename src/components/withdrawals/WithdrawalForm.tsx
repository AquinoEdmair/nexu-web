'use client';

import { useEffect, useState } from 'react';
import { useBalance } from '@/lib/hooks/useBalance';
import { useCreateWithdrawal } from '@/lib/hooks/useCreateWithdrawal';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { useWithdrawalCurrencies } from '@/lib/hooks/useWithdrawalCurrencies';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowRight, Loader2, Wallet, Zap, ShieldAlert, TrendingDown, AlertTriangle, QrCode, X, Lock } from 'lucide-react';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

interface WithdrawalPreview {
  rate: number;
  amount: number;
  fee_amount: number;
  net_amount: number;
}

export function WithdrawalForm({ availableBalance }: { availableBalance: string }) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [addressConfirm, setAddressConfirm] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const t = useTranslations('withdrawals');

  const { data: balanceData } = useBalance();
  const { data: currencies, isLoading: currenciesLoading } = useWithdrawalCurrencies();
  const { mutate, isPending, reset } = useCreateWithdrawal();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (currencies && currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0].symbol);
    }
  }, [currencies, selectedCurrency]);

  const numericAmount = parseFloat(amount) || 0;

  const { data: commissionData } = useQuery<{ data: WithdrawalPreview }>({
    queryKey: ['withdrawal-commission', numericAmount],
    queryFn: () => apiClient.get(`/withdrawals/commission-rate?amount=${numericAmount}`).then(r => r.data),
    enabled: numericAmount > 0,
    staleTime: 30_000,
  });

  const preview = commissionData?.data;

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setQrFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setQrPreview(url);
    } else {
      setQrPreview(null);
    }
  };

  const handleQrRemove = () => {
    setQrFile(null);
    setQrPreview(null);
  };

  const handleSubmit = () => {
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    
    const isAddressValid = address.length >= 20 && address === addressConfirm;
    const isQrValid = qrFile !== null;

    if (!isAddressValid && !isQrValid) return;
    reset();
    mutate(
      { amount: numericAmount, currency: selectedCurrency, destination_address: address, qr_image: qrFile },
      {
        onSuccess: () => {
          addNotification({ type: 'success', title: 'Protocolo de Salida Iniciado', message: `Solicitud de ${numericAmount} ${selectedCurrency} en proceso de validación.` });
          setAmount(''); setAddress(''); setAddressConfirm(''); setQrFile(null); setQrPreview(null);
        },
        onError: (err) => {
          const message = err instanceof AxiosError
            ? err.response?.data?.message ?? 'Error en la ejecución de liquidez.'
            : 'Fallo de protocolo inesperado.';
          addNotification({ type: 'error', title: 'Error de Seguridad', message });
        },
      },
    );
  };

  const handleMax = () => setAmount((Math.floor(parseFloat(availableBalance) * 100) / 100).toFixed(2));
  const handleSelectCurrency = (currency: string) => { setSelectedCurrency(currency); reset(); };

  const isAddressValid   = address.length >= 20 && address === addressConfirm;
  const isQrValid        = qrFile !== null;
  const addressMismatch = addressConfirm.length > 0 && address !== addressConfirm;
  const hasCommission    = preview && preview.rate > 0 && numericAmount > 0;
  const isFormValid      = numericAmount > 0 && (isAddressValid || isQrValid) && numericAmount <= parseFloat(availableBalance) && !!selectedCurrency;

  return (
    <div className="space-y-6">
      <div className="relative">
        <span className="absolute inset-y-0 left-5 flex items-center font-black text-lg text-nexus-blue-light pointer-events-none">$</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-24 text-white font-black text-xl outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
        />
        <button
          onClick={handleMax}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-nexus-blue-light uppercase tracking-widest px-4 py-1.5 bg-nexus-blue/10 rounded-lg hover:bg-nexus-blue hover:text-white transition-all border border-nexus-blue/20"
        >
          MÁX
        </button>
      </div>
      <p className="text-[10px] text-white/40 font-medium">Máximo disponible: ${formatCurrency(availableBalance)} USDT</p>

      {hasCommission && (
        <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/80">{t('breakdown')}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-white/40 font-black uppercase tracking-widest">{t('gross')}</span>
            <span className="text-white font-black">${preview.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-amber-400/70 font-black uppercase tracking-widest">{t('commission')} ({preview.rate}%)</span>
            <span className="text-amber-400/80 font-black">-${preview.fee_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] border-t border-white/5 pt-2">
            <span className="text-white font-black uppercase tracking-widest">{t('youReceive')}</span>
            <span className="text-nexus-blue-light font-black text-base">${preview.net_amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light flex items-center gap-1.5">
            <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
            Dirección de Wallet (USDT)
            <span className="text-nexus-blue-light/40 normal-case tracking-normal font-bold ml-auto">* REQUERIDO</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Pega tu dirección aquí..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 tracking-wide font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-red-400 rounded-full inline-block" />
            Confirmar Dirección
            <span className="text-red-400/40 normal-case tracking-normal font-bold ml-auto">* REQUERIDO</span>
          </label>
          <input
            type="text"
            value={addressConfirm}
            onChange={(e) => setAddressConfirm(e.target.value)}
            placeholder="Vuelve a pegar tu dirección..."
            className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white font-black text-xs outline-none transition-all placeholder:text-white/10 tracking-wide font-mono ${
              addressMismatch
                ? 'border-red-500/60 focus:border-red-500 bg-red-500/5'
                : 'border-white/10 focus:border-nexus-blue/50 focus:bg-white/[0.08]'
            }`}
          />
          {addressMismatch && (
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <TrendingDown className="w-3 h-3" /> {t('addressMismatch')}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-blue-light flex items-center gap-1.5">
          <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
          Red de Destino
          <span className="text-nexus-blue-light/40 normal-case tracking-normal font-bold ml-auto">* REQUERIDO</span>
        </label>
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => handleSelectCurrency(e.target.value)}
            className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all cursor-pointer uppercase tracking-widest"
          >
            <option value="" disabled className="bg-[#0a0f16]">Selecciona la red</option>
            {currencies?.map(c => (
              <option key={c.symbol} value={c.symbol} className="bg-[#0a0f16]">
                {c.symbol} {c.network ? `(${c.network})` : ''}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
          <span className="w-1 h-3 bg-nexus-blue rounded-full inline-block" />
          QR de destino (Opcional)
        </label>

        {qrPreview ? (
          <div className="relative w-full border border-white/10 rounded-2xl p-4 bg-white/[0.02] flex items-center gap-4">
            <img
              src={qrPreview}
              alt="QR preview"
              className="h-16 w-16 object-contain rounded-xl border border-nexus-blue/30 bg-white/5 p-1"
            />
            <div className="flex-1">
              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">QR Adjunto</p>
              <p className="text-[9px] text-white/40 uppercase">Listo para revisión</p>
            </div>
            <button
              type="button"
              onClick={handleQrRemove}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg p-2 transition-colors border border-red-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-4 w-full border border-dashed border-white/10 hover:border-nexus-blue/40 rounded-xl py-4 px-4 cursor-pointer transition-colors group bg-white/[0.02] hover:bg-white/5">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-nexus-blue/10 transition-colors">
              <QrCode className="w-5 h-5 text-white/30 group-hover:text-nexus-blue-light transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                Adjuntar imagen del QR
              </span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">JPG, PNG, WEBP · Máx. 5 MB</span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleQrChange}
            />
          </label>
        )}
      </div>

      <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Verifica cuidadosamente la información</p>
          <p className="text-[10px] text-amber-500/60 leading-relaxed uppercase">
            Una vez procesado, el retiro no puede ser cancelado ni revertido.
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || !isFormValid}
        className="w-full py-4 bg-nexus-blue text-white font-black rounded-xl hover:bg-nexus-blue-light hover:shadow-[0_0_30px_rgba(11,64,193,0.3)] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] mt-6"
      >
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {t('submitting')}</>
        ) : (
          <>Ejecutar Retiro <ArrowRight className="h-4 w-4" /></>
        )}
      </button>
    </div>
  );
}

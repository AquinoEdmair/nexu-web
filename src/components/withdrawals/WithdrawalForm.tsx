'use client';

import { useEffect, useState } from 'react';
import { useBalance } from '@/lib/hooks/useBalance';
import { useCreateWithdrawal } from '@/lib/hooks/useCreateWithdrawal';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { useWithdrawalCurrencies } from '@/lib/hooks/useWithdrawalCurrencies';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowRight, Loader2, Wallet, Zap, ShieldAlert, TrendingDown, AlertTriangle, QrCode, X } from 'lucide-react';
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

export function WithdrawalForm() {
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

  const balance = balanceData?.data;
  const availableBalance = balance?.balance_in_operation ?? '0';
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
    <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">

      <div className="px-8 py-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-nexus-blue/10 rounded-xl border border-nexus-blue/20">
              <Wallet className="h-4 w-4 text-nexus-blue-light" />
            </div>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{t('available')}</p>
              <FormattedAmount amount={availableBalance} className="text-xl" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {currenciesLoading ? (
              <div className="px-3 py-1.5 flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 text-white/20 animate-spin" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('submitting')}</span>
              </div>
            ) : currencies && currencies.length > 0 ? (
              currencies.map((c) => {
                const isSelected = selectedCurrency === c.symbol;
                return (
                  <button
                    key={c.symbol}
                    onClick={() => handleSelectCurrency(c.symbol)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      isSelected
                        ? 'bg-nexus-blue text-white shadow-[0_0_12px_rgba(11,64,193,0.3)]'
                        : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {c.symbol}
                    {c.network && <span className="text-[8px] opacity-60">({c.network})</span>}
                  </button>
                );
              })
            ) : (
              <span className="px-3 py-1.5 text-[10px] font-black text-white/20 uppercase tracking-widest">{t('noCurrencies')}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
          <Zap className="w-3 h-3 text-nexus-blue-light fill-nexus-blue-light" />
          <span className="text-[9px] font-black text-nexus-blue-light uppercase tracking-widest">{t('hmacValidation')}</span>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
            {t('amount')}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-5 flex items-center font-black text-lg text-nexus-blue-light pointer-events-none">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-16 text-white font-black text-xl outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
            />
            <button
              onClick={handleMax}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-nexus-blue-light uppercase tracking-widest px-2.5 py-1 bg-nexus-blue/10 rounded-lg hover:bg-nexus-blue hover:text-white transition-all border border-nexus-blue/20"
            >
              {t('max')}
            </button>
          </div>
        </div>

        <div className="flex items-end">
          {hasCommission ? (
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
          ) : (
            <div className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-white/10 shrink-0" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('commissionPlaceholder')}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
            {t('walletAddress')} {selectedCurrency ? `(${selectedCurrency})` : ''}
            {!isQrValid && <span className="text-nexus-blue-light/40 normal-case tracking-normal font-bold ml-auto">* REQUERIDO</span>}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Pega tu dirección aquí..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-black text-sm outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 tracking-wide font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-red-400 rounded-full inline-block" />
            {t('confirmAddress')}
          </label>
          <input
            type="text"
            value={addressConfirm}
            onChange={(e) => setAddressConfirm(e.target.value)}
            placeholder="Vuelve a pegar tu dirección..."
            className={`w-full bg-white/5 border rounded-2xl py-4 px-5 text-white font-black text-sm outline-none transition-all placeholder:text-white/10 tracking-wide font-mono ${
              addressMismatch
                ? 'border-red-500/60 focus:border-red-500 bg-red-500/5'
                : 'border-white/10 focus:border-nexus-blue/50 focus:bg-white/[0.08]'
            }`}
          />
          {addressMismatch && (
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingDown className="w-3 h-3" /> {t('addressMismatch')}
            </p>
          )}
        </div>

        {/* QR Image Upload */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
            <span className="w-1 h-3 bg-nexus-blue rounded-full inline-block" />
            QR de destino {!isAddressValid && <span className="text-nexus-blue-light/40 normal-case tracking-normal font-bold ml-auto">* REQUERIDO</span>}
          </label>

          {qrPreview ? (
            <div className="relative w-fit">
              <img
                src={qrPreview}
                alt="QR preview"
                className="h-36 w-36 object-contain rounded-2xl border border-nexus-blue/30 bg-white/5 p-2"
              />
              <button
                type="button"
                onClick={handleQrRemove}
                className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-white/10 hover:border-nexus-blue/40 rounded-2xl py-6 px-4 cursor-pointer transition-colors group bg-white/[0.02] hover:bg-white/5">
              <QrCode className="w-6 h-6 text-white/20 group-hover:text-nexus-blue-light transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                Adjuntar imagen del QR
              </span>
              <span className="text-[9px] text-white/10 uppercase tracking-widest">JPG, PNG, WEBP · Máx. 5 MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleQrChange}
              />
            </label>
          )}
        </div>

        <div className="md:col-span-2 flex gap-4 p-4 bg-red-500/5 border border-red-500/15 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.2em] mb-0.5">{t('criticalWarning')}</p>
            <p className="text-[10px] font-black leading-relaxed text-red-400/60 uppercase tracking-tight">
              {t('criticalWarningDetail')}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-nexus-blue" />
          <ShieldAlert className="h-4 w-4 shrink-0 text-nexus-blue-light mt-0.5" />
          <p className="text-[10px] font-black leading-relaxed text-white/30 uppercase tracking-tight">
            {t('processInfo')}
          </p>
        </div>

        <div className="md:col-span-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || !isFormValid}
            className="w-full py-4 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light hover:shadow-[0_0_30px_rgba(11,64,193,0.3)] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t('submitting')}</>
            ) : (
              <>{hasCommission ? `${t('submitLabel')} $${preview.net_amount.toFixed(2)}` : t('submit')}<ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

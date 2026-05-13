'use client';

import { useBalance } from '@/lib/hooks/useBalance';
import { useGoldPrice } from '@/lib/hooks/useMetrics';
import { formatCurrency } from '@/lib/utils/format';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import { Shield, Wallet, CheckCircle2, Loader2, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useReferralSummary } from '@/lib/hooks/useReferrals';
import { useState } from 'react';

export function BalanceCard() {
  const { data, isLoading, isError, refetch } = useBalance();
  const { data: goldData } = useGoldPrice();
  const t = useTranslations('balance');
  const tr = useTranslations('referrals');
  const { data: referralData } = useReferralSummary();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (referralData?.data.share_url) {
      navigator.clipboard.writeText(referralData.data.share_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2 relative group h-[320px]">
        <div className="absolute inset-0 bg-nexus-blue blur-3xl opacity-5 rounded-full -z-10"></div>
        <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center gap-4">
          <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] text-nexus-blue-light/40 uppercase">{t('updating')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:col-span-2 relative group h-[320px]">
        <div className="h-full bg-white/5 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center text-center gap-4">
          <div className="bg-red-500/10 p-4 rounded-full">
            <Wallet className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-tight">{t('syncError')}</h4>
            <button onClick={() => refetch()} className="text-nexus-blue-light text-xs font-black uppercase hover:underline mt-2">
              {t('retryConnection')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const balance = data?.data;
  if (!balance) return null;

  const goldPrice = goldData?.current ?? 0;
  const ozGold = goldPrice > 0 ? parseFloat(balance.balance_total) / goldPrice : null;
  const ozLabel = ozGold !== null
    ? ozGold.toLocaleString('es-MX', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    : null;

  return (
    <div className="lg:col-span-2 relative group min-h-[320px]">
      <div className="absolute inset-0 bg-nexus-blue blur-[100px] opacity-5 rounded-full -z-10"></div>
      <div className="h-full bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden transition-all hover:border-nexus-blue/30 shadow-[0_0_50px_rgba(11,64,193,0.05)] flex flex-col justify-between">

        <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
          <Shield className="w-64 h-64 text-nexus-blue-light" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-nexus-blue-light animate-pulse"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/80 uppercase">{t('operationLabel')}</span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">{t('consolidatedLabel')}</p>
            <div className="flex items-baseline gap-4 flex-wrap">
              <FormattedAmount
                amount={balance.balance_total}
                integerClassName="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(24,136,243,0.2)]"
                decimalClassName="text-2xl md:text-3xl font-black text-white/40 tracking-tighter"
              />
              <span className="text-nexus-blue-light font-black text-lg uppercase tracking-[0.2em]">{balance.currency}</span>
              {ozLabel && (
                <span className="text-amber-400/70 font-black text-sm uppercase tracking-widest">
                  ≈ {ozLabel} oz XAU
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">{t('inOperation')}</p>
            <p className="text-xl font-black text-white group-hover:text-nexus-blue-light transition-colors">
              ${formatCurrency(balance.balance_in_operation)}
            </p>
            {referralData?.data.share_url && (
              <div className="mt-3 space-y-1">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{tr('linkLabel')}</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-nexus-blue-light/30 transition-all group/copy"
                >
                  <span className="text-[9px] font-black text-nexus-blue-light/60 uppercase tracking-widest truncate max-w-[120px]">
                    {referralData.data.share_url.replace(/^https?:\/\//, '')}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-nexus-blue-light/40 group-hover/copy:text-nexus-blue-light transition-colors" />
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">{t('securityStatus')}</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-nexus-blue-light" />
              <p className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">{t('activeProtection')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

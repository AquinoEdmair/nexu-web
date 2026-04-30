'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Shield, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useBalance } from '@/lib/hooks/useBalance';
import { formatCurrency } from '@/lib/utils/format';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: balanceData } = useBalance();
  const balance = balanceData?.data;

  const memberSince = balance?.member_since
    ? new Date(balance.member_since).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : null;

  const firstDeposit = balance?.first_deposit_amount
    ? `$${formatCurrency(balance.first_deposit_amount)}`
    : null;

  return (
    <main className="max-w-7xl mx-auto pt-6 pb-32 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">{t('status')}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{t('title')}</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <Shield className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('vaultGuarantee')}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BalanceCard />
        <div className="lg:col-span-1 bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center relative overflow-hidden group hover:border-nexus-blue/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-nexus-blue/10 blur-3xl rounded-full"></div>
          <div className="space-y-4 flex-1">
            <p className="text-[10px] font-black text-nexus-blue-light/60 uppercase tracking-widest">{t('capitalSecurity')}</p>
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">{t('goldBacking')}</h4>
            <p className="text-xs text-nexus-text/40 leading-relaxed">{t('goldBackingDetail')}</p>
            <p className="text-xs text-nexus-text/40 leading-relaxed mt-2">{t('forexOperationDetail')}</p>
          </div>

          {(memberSince || firstDeposit) && (
            <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
              {memberSince && (
                <p className="text-[9px] font-black text-white/15 uppercase tracking-[0.25em]">
                  Miembro desde · {memberSince}
                </p>
              )}
              {firstDeposit && (
                <p className="text-[9px] font-black text-white/15 uppercase tracking-[0.25em]">
                  Primer depósito · {firstDeposit} USD
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] pl-1">{t('quickActions')}</h2>
        <QuickActions />
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] pl-1">{t('evolution')}</h2>
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <BalanceChart />
          <RecentTransactions />
        </section>
      </div>
    </main>
  );
}

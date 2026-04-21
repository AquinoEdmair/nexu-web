'use client';

import React, { Suspense } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Status = 'success' | 'already' | 'invalid' | 'not_found' | 'unknown';
type Tone = 'success' | 'error' | 'warn';

const STATUS_TONES: Record<Status, Tone> = {
  success:   'success',
  already:   'warn',
  invalid:   'error',
  not_found: 'error',
  unknown:   'error',
};

export default function EmailVerifiedPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-nexus-blue-light" /></div>}>
      <EmailVerifiedPage />
    </Suspense>
  );
}

function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const t = useTranslations('auth.emailVerified');

  const rawStatus = (searchParams.get('status') ?? 'unknown') as Status;
  const status: Status = (['success', 'already', 'invalid', 'not_found'] as const).includes(
    rawStatus as 'success' | 'already' | 'invalid' | 'not_found'
  )
    ? rawStatus
    : 'unknown';

  const tone = STATUS_TONES[status];

  const titleMap: Record<Status, string> = {
    success:   t('verified'),
    already:   t('alreadyVerified'),
    invalid:   t('invalidLink'),
    not_found: t('notFound'),
    unknown:   t('unknownStatus'),
  };

  const messageMap: Record<Status, string> = {
    success:   t('verifiedMessage'),
    already:   t('alreadyMessage'),
    invalid:   t('invalidMessage'),
    not_found: t('notFoundMessage'),
    unknown:   t('unknownMessage'),
  };

  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warn' ? AlertCircle : XCircle;

  const toneClasses =
    tone === 'success'
      ? {
          glow: 'bg-emerald-500',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-400',
          shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
        }
      : tone === 'warn'
      ? {
          glow: 'bg-nexus-blue',
          border: 'border-nexus-blue-light/30',
          icon: 'text-nexus-blue-light',
          shadow: 'shadow-[0_0_40px_rgba(11,64,193,0.15)]',
        }
      : {
          glow: 'bg-red-500',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          shadow: 'shadow-[0_0_40px_rgba(239,68,68,0.15)]',
        };

  return (
    <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center pb-20 mx-auto pt-10">
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className={`absolute inset-0 ${toneClasses.glow} blur-3xl opacity-20 rounded-full`}></div>
          <div className={`relative w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border ${toneClasses.border} ${toneClasses.shadow}`}>
            <Icon className={`${toneClasses.icon} w-10 h-10`} />
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase font-headline">{titleMap[status]}</h1>
        <p className="text-nexus-text leading-relaxed px-4 font-medium">{messageMap[status]}</p>
      </div>

      {tone === 'success' || tone === 'warn' ? (
        <Link
          href="/login"
          className="w-full bg-nexus-blue text-white font-black py-5 rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
        >
          <span>{t('signIn')}</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div className="space-y-3">
          <Link
            href="/verify-email-sent"
            className="w-full bg-nexus-blue text-white font-black py-5 rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
          >
            <span>{t('resend')}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            {t('backHome')}
          </Link>
        </div>
      )}
    </div>
  );
}

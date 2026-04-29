'use client';

import React, { useState } from 'react';
import { ChevronLeft, KeyRound, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForgotPassword } from '@/lib/hooks/useAuth';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { sendResetLink, isLoading, isSuccess, error, reset } = useForgotPassword();
  const t = useTranslations('auth.forgotPassword');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) return;

    sendResetLink(result.data);
  };

  return (
    <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center pb-20 mx-auto pt-10">
      <div className="flex items-center gap-3 mb-10 w-full">
        <Link href="/login" className="active:scale-95 transition-transform text-nexus-blue-light hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-nexus-blue blur-3xl opacity-20 rounded-full"></div>
          <div className="relative w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(11,64,193,0.1)]">
            <KeyRound className="text-nexus-blue-light w-10 h-10" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase font-headline">{t('title')}</h1>
        <p className="text-nexus-text leading-relaxed px-4 font-medium">{t('subtitle')}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 pl-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="email">
              {t('email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-nexus-blue-light">
                <Mail className="text-white/20 w-5 h-5" />
              </div>
              <input
                className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 transition-all focus:ring-1 focus:ring-nexus-blue-light outline-none"
                id="email"
                name="email"
                placeholder={t('emailPlaceholder') || 'name@email.com'}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-nexus-blue text-white font-black py-5 rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <span>{t('submit')}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-nexus-blue/5 rounded-xl p-5 border border-nexus-blue-light/20 flex items-start gap-4">
          <div className="bg-nexus-blue/20 p-2 rounded-lg">
            <CheckCircle2 className="text-nexus-blue-light w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{t('successTitle')}</h4>
            <p className="text-xs text-nexus-text/80 font-medium leading-tight">{t('successMessage')}</p>
          </div>
        </div>
      )}

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <p className="text-sm text-nexus-text font-medium">
          {t('rememberPassword')}
          <Link href="/login" className="text-nexus-blue-light font-black ml-2 hover:text-white transition-all uppercase tracking-tighter">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}

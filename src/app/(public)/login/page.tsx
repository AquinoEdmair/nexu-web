'use client';

import React, { useState, Suspense } from 'react';
import { AtSign, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useAuth';
import { loginSchema } from '@/lib/validators/auth';
import { useTranslations } from 'next-intl';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-nexus-blue-light" /></div>}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { login, isLoading, error, fieldErrors, reset } = useLogin();
  const t = useTranslations('auth.login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    if (!captchaToken) return;

    const result = loginSchema.safeParse({ email, password, captcha_token: captchaToken });
    if (!result.success) return;

    login(result.data);
  };

  return (
    <div className="flex-grow flex flex-col px-8 pb-10 max-w-md mx-auto w-full justify-center">
      {/* Welcome Section */}
      <div className="mt-4 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">{t('title')}</h1>
        <p className="text-nexus-text text-sm font-medium tracking-wide">{t('subtitle')}</p>
      </div>

      {/* Server Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Field: Email */}
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 mb-2 group-focus-within:text-nexus-blue-light transition-colors">
            {t('email')}
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-nexus-blue-light transition-all outline-none"
              placeholder={t('emailPlaceholder')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">
              <AtSign className="w-5 h-5" />
            </div>
          </div>
          {fieldErrors?.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Input Field: Password */}
        <div className="group">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 group-focus-within:text-nexus-blue-light transition-colors">
              {t('password')}
            </label>
            <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-nexus-blue-light hover:text-white transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white placeholder:text-white/20 focus:ring-1 focus:ring-nexus-blue-light transition-all outline-none"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-nexus-blue-light transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* CAPTCHA */}
        <TurnstileWidget
          onSuccess={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          onError={() => setCaptchaToken(null)}
        />

        {/* CTA Section */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !captchaToken}
            className="w-full bg-nexus-blue text-white font-black py-5 rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              t('submit')
            )}
          </button>
        </div>
      </form>

      {/* Registration Link */}
      <div className="mt-8 text-center pb-8 border-t border-white/5 pt-8">
        <p className="text-sm text-nexus-text/60 font-medium tracking-wide">
          {t('noAccount')}
          <Link href="/register" className="text-nexus-blue-light font-black ml-2 hover:text-white transition-all uppercase tracking-tighter">
            {t('joinElite')}
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState, Suspense } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function VerifyEmailSentPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-nexus-blue-light" /></div>}>
      <VerifyEmailSentPage />
    </Suspense>
  );
}

function VerifyEmailSentPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(emailFromQuery);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResent(false);

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerificationByEmail(email);
      setResent(true);
    } catch {
      setError('No pudimos reenviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center pb-20 mx-auto pt-10">
      {/* Visual Anchor */}
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-nexus-blue blur-3xl opacity-20 rounded-full"></div>
          <div className="relative w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(11,64,193,0.1)]">
            <Mail className="text-nexus-blue-light w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase font-headline">Verifica tu correo</h1>
        <p className="text-nexus-text leading-relaxed px-4 font-medium">
          Te enviamos un enlace de verificación{emailFromQuery ? ' a ' : '.'}
          {emailFromQuery && <span className="text-nexus-blue-light font-black">{emailFromQuery}</span>}
          {emailFromQuery ? '.' : ''} Haz click en el botón del correo para activar tu cuenta.
        </p>
      </div>

      {/* Info block */}
      <div className="bg-nexus-blue/5 rounded-xl p-5 border border-nexus-blue-light/20 flex items-start gap-4 mb-8">
        <div className="bg-nexus-blue/20 p-2 rounded-lg shrink-0">
          <CheckCircle2 className="text-nexus-blue-light w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">Revisa tu bandeja de entrada</h4>
          <p className="text-xs text-nexus-text/80 font-medium leading-tight">
            Si no lo encuentras, revisa tu carpeta de spam o correo no deseado. El enlace expira en 60 minutos.
          </p>
        </div>
      </div>

      {/* Resend */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {resent ? (
        <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          Si el correo existe y aún no está verificado, enviamos un nuevo enlace.
        </div>
      ) : (
        <form onSubmit={handleResend} className="space-y-4">
          <div className="space-y-2 group">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 pl-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="resend-email">
              ¿No recibiste el correo?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-nexus-blue-light">
                <Mail className="text-white/20 w-5 h-5" />
              </div>
              <input
                className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 transition-all focus:ring-1 focus:ring-nexus-blue-light outline-none"
                id="resend-email"
                name="email"
                placeholder="nombre@correo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isResending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isResending}
            className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Reenviar enlace</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* CTA */}
      <Link
        href="/login"
        className="mt-6 w-full bg-nexus-blue text-white font-black py-5 rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
      >
        <span>Ir a iniciar sesión</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
        <p className="text-sm text-nexus-text font-medium">
          ¿Ya verificaste tu cuenta?
          <Link href="/login" className="text-nexus-blue-light font-black ml-2 hover:text-white transition-all uppercase tracking-tighter">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

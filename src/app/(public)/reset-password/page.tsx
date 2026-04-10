'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { ChevronLeft, KeyRound, Eye, EyeOff, CheckCircle2, Circle, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useResetPassword } from '@/lib/hooks/useAuth';
import { resetPasswordSchema } from '@/lib/validators/auth';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-nexus-blue-light" /></div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const emailParam = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isLoading, error, fieldErrors, reset } = useResetPassword();

  const requirements = useMemo(() => ({
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    numberOrSpecial: /[0-9!@#$%^&*]/.test(password),
  }), [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    const result = resetPasswordSchema.safeParse({
      email: emailParam,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
    if (!result.success) return;

    resetPassword(result.data);
  };

  return (
    <div className="flex-grow px-6 pt-12 pb-24 flex flex-col items-center max-w-md mx-auto w-full">
      {/* Header with back button */}
      <div className="flex justify-between items-center w-full mb-10 text-white">
        <div className="flex items-center gap-3">
          <Link href="/login" className="active:scale-95 transition-transform text-nexus-blue-light hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Abstract Security Iconography */}
      <div className="mb-10 relative">
        <div className="absolute inset-0 bg-nexus-blue blur-3xl opacity-20 rounded-full"></div>
        <div className="relative w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(11,64,193,0.1)]">
          <KeyRound className="text-nexus-blue-light w-10 h-10" />
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white tracking-tighter mb-3 uppercase">Restablecimiento de Acceso</h2>
        <p className="text-nexus-text text-sm font-medium leading-relaxed">Define tus nuevas credenciales de seguridad institucional para proteger tu infraestructura financiera.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors">Nueva Contraseña</label>
          <div className="relative group bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-nexus-blue-light">
            <input
              className="w-full bg-transparent border-none py-4 px-5 text-white placeholder-white/20 focus:ring-0 focus:outline-none font-medium outline-none"
              placeholder="••••••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              {showPassword ? (
                <EyeOff className="text-white/20 w-5 h-5 cursor-pointer hover:text-nexus-blue-light transition-colors" />
              ) : (
                <Eye className="text-white/20 w-5 h-5 cursor-pointer hover:text-nexus-blue-light transition-colors" />
              )}
            </button>
          </div>
          {fieldErrors?.password && <p className="text-xs text-red-400 ml-1">{fieldErrors.password[0]}</p>}
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors">Confirmar Nueva Contraseña</label>
          <div className="relative group bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-nexus-blue-light">
            <input
              className="w-full bg-transparent border-none py-4 px-5 text-white placeholder-white/20 focus:ring-0 focus:outline-none font-medium outline-none"
              placeholder="••••••••••••"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {password && passwordConfirmation && password !== passwordConfirmation && (
            <p className="text-xs text-red-400 ml-1">Las contraseñas no coinciden</p>
          )}
        </div>

        {/* Security Requirements */}
        <div className="bg-nexus-blue/5 rounded-2xl p-5 border border-nexus-blue-light/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-blue-light animate-pulse"></div>
            <span className="text-[10px] font-black tracking-widest uppercase text-nexus-blue-light/80">Protocolo de Seguridad Institucional</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 py-1">
              {requirements.minLength ? (
                <CheckCircle2 className="text-nexus-blue-light w-4 h-4" />
              ) : (
                <Circle className="text-white/10 w-4 h-4" />
              )}
              <span className={`text-xs font-medium ${requirements.minLength ? 'text-white' : 'text-white/30'}`}>
                Mínimo 8 caracteres
              </span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {requirements.uppercase ? (
                <CheckCircle2 className="text-nexus-blue-light w-4 h-4" />
              ) : (
                <Circle className="text-white/10 w-4 h-4" />
              )}
              <span className={`text-xs font-medium ${requirements.uppercase ? 'text-white' : 'text-white/30'}`}>
                Al menos una letra mayúscula
              </span>
            </div>
            <div className="flex items-center gap-3 py-1">
              {requirements.numberOrSpecial ? (
                <CheckCircle2 className="text-nexus-blue-light w-4 h-4" />
              ) : (
                <Circle className="text-white/10 w-4 h-4" />
              )}
              <span className={`text-xs font-medium ${requirements.numberOrSpecial ? 'text-white' : 'text-white/30'}`}>
                Incluye números o símbolos especiales
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-nexus-blue text-white font-black rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Actualizando Seguridad...
              </>
            ) : (
              <>
                Confirmar Restablecimiento
                <Shield className="w-5 h-5 transition-transform group-hover:scale-110" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Informational Visual */}
      <div className="mt-12 w-full rounded-3xl overflow-hidden relative h-32 bg-white/5 flex items-center p-6 border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-blue/10 blur-3xl -z-10"></div>
        <div className="flex-1 z-10">
          <h4 className="text-xs font-black text-white mb-1 uppercase tracking-tighter">Capa de Seguridad NEXU</h4>
          <p className="text-[10px] text-nexus-text/60 font-medium leading-tight">Tus credenciales se procesan bajo protocolos HMAC de alta seguridad. Nunca almacenamos datos sensibles en texto plano.</p>
        </div>
      </div>
    </div>
  );
}

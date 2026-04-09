'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Award, Loader2, User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRegister } from '@/lib/hooks/useAuth';
import { registerSchema } from '@/lib/validators/auth';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') ?? '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    referral_code: refCode,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error, fieldErrors, reset } = useRegister();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setClientErrors({});

    if (!termsAccepted) {
      setClientErrors({ terms: 'Debes aceptar los términos y condiciones.' });
      return;
    }

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const flat: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !flat[key]) flat[key] = issue.message;
      }
      setClientErrors(flat);
      return;
    }

    register(result.data);
  };

  const getError = (field: string): string | undefined => {
    return clientErrors[field] ?? fieldErrors?.[field]?.[0];
  };

  return (
    <div className="flex-grow flex flex-col px-6 pb-12 pt-8 z-10 max-w-md mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter leading-tight mb-2 uppercase">Registro de Inversor Élite</h1>
        <p className="text-nexus-text text-base font-medium">Inicia tu portafolio de Oro Digital y accede a rendimientos automatizados.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="full_name">
            Nombre Completo
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="full_name"
              placeholder="Ej: Alexander Vault"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-nexus-blue-light transition-colors">
              <User className="w-5 h-5" />
            </div>
          </div>
          {getError('name') && <p className="text-xs text-red-400 ml-1">{getError('name')}</p>}
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="email">
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="email"
              placeholder="nombre@correo.com"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-nexus-blue-light transition-colors">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          {getError('email') && <p className="text-xs text-nexus-blue-light ml-1 mt-1">{getError('email')}</p>}
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="phone">
            Teléfono (Opcional)
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="phone"
              placeholder="+52 55 1234 5678"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-nexus-blue-light transition-colors">
              <Phone className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="password">
            Contraseña Segura
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 cursor-pointer hover:text-nexus-blue-light transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {getError('password') && <p className="text-xs text-red-400 ml-1">{getError('password')}</p>}
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="confirm_password">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="confirm_password"
              placeholder="••••••••"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => updateField('password_confirmation', e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-nexus-blue-light transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          {getError('password_confirmation') && <p className="text-xs text-nexus-blue-light ml-1 mt-1">{getError('password_confirmation')}</p>}
        </div>

        <div className="space-y-1.5 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60 ml-1 group-focus-within:text-nexus-blue-light transition-colors" htmlFor="referral">
            Código Elite (Opcional)
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-white focus:ring-1 focus:ring-nexus-blue-light placeholder:text-white/20 transition-all outline-none"
              id="referral"
              placeholder="CÓDIGO DE INVITACIÓN"
              type="text"
              value={form.referral_code}
              onChange={(e) => updateField('referral_code', e.target.value)}
              disabled={isLoading}
            />
            <Award className="absolute right-4 top-1/2 -translate-y-1/2 text-nexus-blue-light w-5 h-5 shadow-[0_0_10px_rgba(24,136,243,0.3)]" />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 px-1 pt-2">
          <div className="relative flex items-center h-5">
            <input
              className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-nexus-blue focus:ring-nexus-blue-light focus:ring-offset-background"
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked) {
                  setClientErrors((prev) => {
                    const next = { ...prev };
                    delete next.terms;
                    return next;
                  });
                }
              }}
              disabled={isLoading}
            />
          </div>
          <label className="text-sm text-nexus-text/60 leading-snug font-medium" htmlFor="terms">
            Acepto los <span className="text-nexus-blue-light font-black hover:underline cursor-pointer transition-all">Términos de Servicio</span> y la <span className="text-nexus-blue-light font-black hover:underline cursor-pointer transition-all">Política de Privacidad</span>.
          </label>
        </div>
        {getError('terms') && <p className="text-xs text-red-400 ml-1">{getError('terms')}</p>}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-nexus-blue text-white font-black rounded-xl shadow-[0_0_30px_rgba(11,64,193,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validando datos...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </div>
      </form>

      <div className="mt-10 text-center pb-12 border-t border-white/5 pt-8">
        <p className="text-nexus-text/60 font-medium">
          ¿Ya tienes una cuenta?
          <Link href="/login" className="text-nexus-blue-light font-black ml-2 hover:text-white transition-all uppercase tracking-tighter">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

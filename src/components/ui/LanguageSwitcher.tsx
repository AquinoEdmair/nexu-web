'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { setLocale } from '@/lib/actions/locale';
import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => {
    const next = locale === 'es' ? 'en' : 'es';
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-nexus-blue-light/40 hover:bg-nexus-blue/10 transition-all disabled:opacity-40"
      title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${locale === 'es' ? 'text-nexus-blue-light' : 'text-white/30'}`}>ES</span>
      <span className="text-white/20 text-[9px]">/</span>
      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${locale === 'en' ? 'text-nexus-blue-light' : 'text-white/30'}`}>EN</span>
    </button>
  );
}

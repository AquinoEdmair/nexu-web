'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';

export function TurnstileWidget({ onSuccess, onExpire, onError }: TurnstileWidgetProps) {
  const vt = useTranslations('validation');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-3.5 h-3.5 text-nexus-blue-light" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-text/60">
          {vt('securityVerification')}
        </span>
      </div>
      <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5 w-full flex items-center justify-center min-h-[65px]">
        <Turnstile
          siteKey={SITE_KEY}
          options={{
            theme: 'dark',
            size: 'flexible',
          }}
          onSuccess={onSuccess}
          onExpire={onExpire}
          onError={onError}
        />
      </div>
    </div>
  );
}

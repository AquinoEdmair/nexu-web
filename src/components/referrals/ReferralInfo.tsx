'use client';

import { useState } from 'react';
import { Copy, Share2, CheckCircle2 } from 'lucide-react';
import type { ReferralSummary } from '@/types/models';

interface ReferralInfoProps {
  summary: ReferralSummary;
}

export function ReferralInfo({ summary }: ReferralInfoProps) {
  const [codeCopied,  setCodeCopied]  = useState(false);
  const [linkCopied,  setLinkCopied]  = useState(false);

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const tier = summary.elite.tier;
  const firstPct  = tier ? (parseFloat(tier.first_deposit_commission_rate) * 100).toFixed(0) : null;
  const recurPct  = tier ? (parseFloat(tier.recurring_commission_rate)      * 100).toFixed(0) : null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Code card */}
      <div className="bg-[#0a0f16]/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col justify-between space-y-8 hover:border-nexus-blue/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div>
          <h3 className="text-white/20 font-black tracking-[0.3em] uppercase text-[9px] mb-4">
            Tu Código Elite
          </h3>
          <button
            type="button"
            onClick={() => copyToClipboard(summary.code, setCodeCopied)}
            className="w-full flex items-center justify-between bg-white/5 px-6 py-5 rounded-2xl border border-white/5 hover:border-nexus-blue/30 transition-all group/code"
          >
            <span className="text-2xl font-black tracking-[0.2em] text-white">
              {summary.code}
            </span>
            {codeCopied
              ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              : <Copy className="h-5 w-5 text-nexus-blue-light hover:scale-110 transition-transform shrink-0" />
            }
          </button>
        </div>
        <p className="text-xs text-nexus-text/40 font-medium leading-relaxed uppercase tracking-wider">
          {firstPct !== null ? (
            <>
              Atrae nuevos inversionistas a Nexu — comparte tu código y obtén una comisión del{' '}
              <span className="text-nexus-blue-light">{firstPct}%</span>{' '}
              en el primer depósito de tu invitado
              {recurPct !== null && recurPct !== '0' && (
                <> y <span className="text-nexus-blue-light">{recurPct}%</span> en depósitos recurrentes</>
              )}.
            </>
          ) : (
            <>
              Atrae nuevos inversionistas a Nexu — comparte tu código y gana comisiones por cada invitado activo.
              Completa tu perfil para ver tu tasa de comisión.
            </>
          )}
        </p>
      </div>

      {/* Link card */}
      <div className="bg-[#0a0f16]/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl flex flex-col justify-between space-y-8 hover:border-nexus-blue/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div>
          <h3 className="text-white/20 font-black tracking-[0.3em] uppercase text-[9px] mb-4">
            Enlace de Invitación
          </h3>
          <button
            type="button"
            onClick={() => copyToClipboard(summary.share_url, setLinkCopied)}
            className="w-full flex items-center justify-between bg-white/5 px-6 py-5 rounded-2xl border border-white/5 hover:border-nexus-blue/30 transition-all"
          >
            <span className="text-xs font-black text-white/60 truncate pr-4 uppercase tracking-tighter">
              {summary.share_url.replace('https://', '')}
            </span>
            {linkCopied
              ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              : <Share2 className="h-5 w-5 text-nexus-blue-light hover:scale-110 transition-transform shrink-0" />
            }
          </button>
        </div>
        <div className="pt-2">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            Tu enlace de invitación es único y personal.
          </p>
        </div>
      </div>
    </section>
  );
}

import { Star } from 'lucide-react';
import type { ReferralElite } from '@/types/models';

const TIER_LABELS: Record<string, string> = {
  bronze:   'Bronce',
  silver:   'Plata',
  gold:     'Oro',
  platinum: 'Platino',
};

interface EliteProgressProps {
  elite: ReferralElite;
}

export function EliteProgress({ elite }: EliteProgressProps) {
  const tierLabel     = TIER_LABELS[elite.tier] ?? elite.tier;
  const nextTierLabel = elite.next_tier ? TIER_LABELS[elite.next_tier] : null;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] p-10 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] group hover:border-nexus-blue/20 transition-all">
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-nexus-blue/5 rounded-full blur-[100px] group-hover:bg-nexus-blue/10 transition-colors" />

      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-nexus-blue-light/40 uppercase tracking-[0.3em] block mb-2">
              Categoría de Membresía
            </span>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">
              Nivel {tierLabel}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">
              Próximo Hito
            </span>
            <p className="text-nexus-blue-light font-black text-xl uppercase tracking-widest">
              {nextTierLabel ? `Elite ${nextTierLabel}` : '¡Nivel Máximo!'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5 p-1">
            <div
              className="h-full bg-gradient-to-r from-nexus-blue to-nexus-blue-light rounded-full shadow-[0_0_20px_rgba(24,136,243,0.4)] relative transition-all duration-700"
              style={{ width: `${elite.progress_pct}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <div className="flex justify-between text-[9px] font-black tracking-[0.3em] uppercase">
            <span className={elite.tier === 'bronze'   ? 'text-nexus-blue-light' : 'text-white/40'}>Bronce</span>
            <span className={elite.tier === 'silver'   ? 'text-nexus-blue-light' : 'text-white/20'}>Plata</span>
            <span className={elite.tier === 'gold'     ? 'text-nexus-blue-light' : 'text-white/20'}>Oro</span>
            <span className={elite.tier === 'platinum' ? 'text-nexus-blue-light' : 'text-white/10'}>Platino</span>
          </div>
        </div>

        <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <div className="p-3 bg-nexus-blue/10 rounded-2xl border border-nexus-blue/20 shrink-0">
            <Star className="h-6 w-6 text-nexus-blue-light fill-nexus-blue-light" />
          </div>
          {elite.points_to_next !== null ? (
            <p className="text-sm text-nexus-text/60 font-medium">
              Estás a{' '}
              <span className="text-white font-black tracking-tighter">
                {parseFloat(elite.points_to_next).toLocaleString('es-MX', { maximumFractionDigits: 0 })} pts
              </span>{' '}
              de desbloquear los{' '}
              <span className="text-nexus-blue-light font-black uppercase tracking-widest text-[10px]">
                Beneficios {nextTierLabel} Elite
              </span>.
            </p>
          ) : (
            <p className="text-sm text-nexus-text/60 font-medium">
              Eres <span className="text-nexus-blue-light font-black uppercase">Platino</span> — nivel máximo alcanzado.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

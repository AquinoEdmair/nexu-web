import { ArrowUpRight } from 'lucide-react';
import type { ReferralStats } from '@/types/models';

interface ReferralEarningsProps {
  stats: ReferralStats;
}

export function ReferralEarnings({ stats }: ReferralEarningsProps) {
  const totalFormatted = parseFloat(stats.total_earned).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className="pb-10">
      <div className="bg-[#0a0f16]/60 border border-nexus-blue-light/20 p-10 rounded-[2.5rem] backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-nexus-blue/20 group-hover:bg-nexus-blue-light transition-colors" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-[10px] font-black text-nexus-blue-light/40 uppercase tracking-[0.4em]">
            Comisiones de Red Acumuladas
          </h3>
          <p className="text-5xl font-black text-white tracking-tighter">
            ${totalFormatted}
          </p>
          <p className="text-xs text-white/20 font-medium">
            {stats.active_count} invitado{stats.active_count !== 1 ? 's' : ''} activo{stats.active_count !== 1 ? 's' : ''} ·{' '}
            {stats.inactive_count} inactivo{stats.inactive_count !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          className="bg-nexus-blue hover:bg-nexus-blue-light text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(11,64,193,0.3)] hover:shadow-[0_15px_40px_rgba(24,136,243,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10 overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10">Retirar Ganancias</span>
          <ArrowUpRight className="w-4 h-4 relative z-10" />
        </button>
      </div>
    </section>
  );
}

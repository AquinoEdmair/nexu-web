'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useGlobalInvestment } from '@/lib/hooks/useMetrics';
import { formatCurrency } from '@/lib/utils/format';
import { Users, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

export function NetworkStats() {
  const { data, isLoading } = useGlobalInvestment();
  const [target, setTarget] = useState({ investment: 0, investors: 0, volume: 0 });

  useEffect(() => {
    if (data) {
      setTarget({
        investment: data.total_investment || 0,
        investors: data.active_investors || 0,
        volume: data.volume_24h || 0
      });
    }
  }, [data]);

  const springConfig = { damping: 25, stiffness: 120 };
  
  // Spring for Investment
  const investmentSpring = useSpring(0, springConfig);
  const displayInvestment = useTransform(investmentSpring, (latest) => 
    formatCurrency(Math.floor(latest))
  );

  // Spring for Investors
  const investorsSpring = useSpring(0, springConfig);
  const displayInvestors = useTransform(investorsSpring, (latest) => 
    Math.floor(latest).toLocaleString()
  );

  // Spring for Volume
  const volumeSpring = useSpring(0, springConfig);
  const displayVolume = useTransform(volumeSpring, (latest) => 
    formatCurrency(latest)
  );

  useEffect(() => {
    investmentSpring.set(target.investment);
    investorsSpring.set(target.investors);
    volumeSpring.set(target.volume);
  }, [target, investmentSpring, investorsSpring, volumeSpring]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Capital en Bóveda',
      value: displayInvestment,
      suffix: ' USD',
      icon: <ShieldCheck className="w-5 h-5 text-nexus-blue-light" />,
      sub: 'Respaldo total en activos',
    },
    {
      label: 'Inversores Activos',
      value: displayInvestors,
      icon: <Users className="w-5 h-5 text-nexus-blue-light" />,
      sub: 'Usuarios con capital iniciado',
    },
    {
      label: 'Volumen 24H',
      value: displayVolume,
      suffix: ' USD',
      icon: <Activity className="w-5 h-5 text-nexus-blue-light" />,
      sub: 'Depósitos de las últimas 24h',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i}
          className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-nexus-blue/30 transition-all font-sans hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="p-2.5 rounded-xl bg-nexus-blue/10 border border-nexus-blue/20 group-hover:bg-nexus-blue/20 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.1)]">
              {stat.icon}
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">{stat.label}</span>
          </div>

          <div className="text-3xl lg:text-4xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] flex items-end gap-2">
            <motion.div>{stat.value}</motion.div>
            {stat.suffix && <span className="text-xl lg:text-2xl text-white/50 tracking-normal mb-0.5">{stat.suffix}</span>}
          </div>
          
          <div className="text-[10px] text-nexus-blue-light/80 mt-4 flex items-center gap-2 font-black tracking-widest uppercase italic">
            <TrendingUp className="w-3.5 h-3.5" />
            {stat.sub}
          </div>

          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-nexus-blue/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}

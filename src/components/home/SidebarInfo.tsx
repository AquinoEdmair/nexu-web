'use client';

import { ShieldCheck, Zap, Lock, Globe, Rocket, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';

export function SidebarInfo() {
  const t = useTranslations('home.sidebar');

  const features = [
    { icon: <Globe className="w-4 h-4" />, title: t('global'), desc: t('globalDesc') },
    { icon: <Lock className="w-4 h-4" />, title: t('secure'), desc: t('secureDesc') },
    { icon: <Zap className="w-4 h-4" />, title: t('instant'), desc: t('instantDesc') },
    { icon: <Rocket className="w-4 h-4" />, title: t('scalable'), desc: t('scalableDesc') },
  ];

  const steps = [
    { n: '01', title: t('step1'), desc: t('step1Desc') },
    { n: '02', title: t('step2'), desc: t('step2Desc') },
    { n: '03', title: t('step3'), desc: t('step3Desc') },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-nexus-blue-light">
          <Cpu className="w-5 h-5 shadow-[0_0_10px_rgba(24,136,243,0.3)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('coreTech')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
          {t('heading')}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed font-medium">
          {t('subtitle')}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="text-nexus-blue-light-light mb-2">{f.icon}</div>
            <div className="text-xs font-black text-white mb-1 uppercase tracking-tighter">{f.title}</div>
            <div className="text-[10px] text-slate-400 font-bold">{f.desc}</div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">{t('protocol')}</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10"></div>

          {steps.map((s, i) => (
            <div key={i} className="flex gap-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-nexus-blue/40 flex items-center justify-center text-[10px] font-black text-nexus-blue-light shadow-[0_0_15px_rgba(11,64,193,0.2)]">
                {s.n}
              </div>
              <div className="flex-1 pt-1">
                <div className="text-sm font-black text-white mb-1 uppercase tracking-tight">{s.title}</div>
                <div className="text-xs text-slate-400 font-medium">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Card className="bg-nexus-blue/5 border-nexus-blue/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex gap-4 items-start relative z-10">
          <ShieldCheck className="w-8 h-8 text-nexus-blue-light shrink-0 shadow-[0_0_20px_rgba(24,136,243,0.2)]" />
          <div>
            <div className="text-sm font-black text-white mb-1 uppercase tracking-tighter">{t('securityTitle')}</div>
            <p className="text-[11px] text-slate-300 leading-normal font-medium">
              {t('securityDetail')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

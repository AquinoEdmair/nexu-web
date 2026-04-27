'use client';

import { FileText, ShieldCheck, ScrollText } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TermsSection() {
  const t = useTranslations('home.terms');
  return (
    <section id="terminos" className="space-y-12 pt-20 border-t border-white/5 pb-20">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <FileText className="w-4 h-4 text-nexus-blue" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-text">{t('badge')}</span>
        </div>
        <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">{t('title')}</h3>
        <p className="max-w-2xl mx-auto text-nexus-text font-medium text-sm leading-relaxed">
          {t('intro')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto h-[500px] glass-card bg-white/[0.01] p-8 lg:p-12 overflow-y-auto custom-scrollbar border-white/5 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ScrollText className="w-32 h-32 text-nexus-blue" />
        </div>
        
        <div className="space-y-10 text-[13px] text-nexus-text/80 font-medium leading-[1.8] tracking-tight uppercase italic indent-8">
          <div className="space-y-4">
            <h4 className="text-white font-black tracking-widest text-[11px] uppercase">{t('s1Title')}</h4>
            <p>{t('s1Body')}</p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">{t('s2Title')}</h4>
             <p>{t('s2Body')}</p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">{t('s3Title')}</h4>
             <p>{t('s3Body')}</p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">{t('s4Title')}</h4>
             <p>{t('s4Body')}</p>
          </div>

          <div className="p-6 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl flex items-center gap-4 text-nexus-blue-light animate-pulse">
             <ShieldCheck className="w-6 h-6 shrink-0" />
             <span className="text-[10px] font-black tracking-[0.2em] italic">{t('pending')}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-nexus-text/30 uppercase tracking-[0.5em]">{t('lastUpdate')}</p>
      </div>
    </section>
  );
}

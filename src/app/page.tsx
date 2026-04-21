'use client';

import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ActivityTicker } from '@/components/home/ActivityTicker';
import { NetworkStats } from '@/components/home/NetworkStats';
import { SidebarInfo } from '@/components/home/SidebarInfo';
import { UserRankingTable } from '@/components/home/UserRankingTable';
import { GoldPriceChart } from '@/components/home/GoldPriceChart';
import { GoldNewsFeed } from '@/components/home/GoldNewsFeed';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactSection } from '@/components/home/ContactSection';
import { TeamSection } from '@/components/home/TeamSection';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations('home');

  const badges = [t('hero.badge1'), t('hero.badge2'), t('hero.badge3')];

  return (
    <div className="min-h-screen bg-[#050b11] text-white font-sans selection:bg-nexus-blue/30 selection:text-nexus-blue overflow-x-hidden">

      <header className="sticky top-0 z-50 w-full bg-[#050b11]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/nexu.png" alt="NEXU" className="h-7 w-auto object-contain" />
            <div className="hidden sm:block h-4 w-px bg-white/10 mx-3" />
            <span className="hidden sm:block text-[9px] font-black text-nexus-text uppercase tracking-[0.4em] italic opacity-80">Powered by Predictive IA</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#quienes-somos" className="text-[10px] font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">{t('nav.about')}</Link>
            <Link href="#equipo" className="text-[10px] font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">{t('nav.team')}</Link>
            <Link href="#contacto" className="text-[10px] font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">{t('nav.contact')}</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">{t('nav.terms')}</Link>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <LanguageSwitcher />
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">
              {t('nav.signIn')}
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full bg-nexus-blue text-white text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(11,64,193,0.3)]"
            >
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col gap-20 lg:gap-32">

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/30">
                <Zap className="w-3.5 h-3.5 text-nexus-blue-light fill-nexus-blue-light shadow-[0_0_10px_rgba(24,136,243,0.4)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light">{t('hero.tagline')}</span>
              </div>
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                {t('hero.title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-blue via-white/90 to-blue-500">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-nexus-text font-medium leading-relaxed max-w-2xl">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {badges.map((badge) => (
                <span key={badge} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-nexus-blue" /> {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-fit inline-flex items-center justify-center gap-3 px-10 py-5 bg-nexus-blue text-white font-black uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(11,64,193,0.4)]"
              >
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>
              <div className="flex items-center gap-2 text-nexus-text">
                <ShieldCheck className="w-5 h-5 text-nexus-blue" />
                <span className="text-xs font-bold uppercase tracking-widest">{t('hero.protection')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="glass-card-glow p-6 lg:p-8 relative border border-nexus-blue/20 hover:border-nexus-blue/40 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('market.chartTitle')}</h3>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-nexus-blue/10 text-nexus-blue-light text-[9px] font-black border border-nexus-blue/20">XAU/USD</span>
              </div>
              <GoldPriceChart />
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="glass-card p-4 lg:p-6 border-white/5 bg-white/[0.02]">
            <ActivityTicker />
          </div>
          <NetworkStats />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-blue-light flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-nexus-blue-light shadow-[0_0_10px_#1888F3]" />
                {t('market.title')}
              </h2>
              <div className="h-px flex-1 mx-8 bg-nexus-blue/10" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                {t('market.goldAsset')}
              </span>
            </div>
            <div className="h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <GoldNewsFeed />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-text">{t('ranking.title')}</h2>
              <div className="h-px flex-1 mx-8 bg-white/5" />
            </div>
            <div className="glass-card p-2 bg-white/[0.01]">
              <UserRankingTable />
            </div>
          </div>
        </section>

        <section className="pt-20 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
                <div className="bg-[#0a0c10] rounded-[22px] p-8 lg:p-12 border border-white/5">
                  <SidebarInfo />
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-6 text-center lg:text-left">
                <h3 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">{t('joinElite')} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-blue to-white">NEXU.</span></h3>
                <p className="text-nexus-text font-medium leading-relaxed">{t('joinEliteSubtitle')}</p>
              </div>
              <div className="flex justify-center lg:justify-start">
                <Link href="/register" className="group bg-nexus-blue text-white font-black py-5 px-12 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-[0_0_40px_rgba(11,64,193,0.3)]">
                  {t('createAccount')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-32">
          <AboutSection />
          <TeamSection />
          <ContactSection />
        </div>

      </main>

      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-nexus-blue/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}

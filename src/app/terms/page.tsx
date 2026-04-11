'use client';

import Link from 'next/link';
import { TermsSection } from '@/components/home/TermsSection';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050b11] text-white font-sans selection:bg-nexus-blue/30 selection:text-nexus-blue overflow-x-hidden">

      {/* 🚀 NAV: Diseño Glow y Minimalista (Replicado de Home) */}
      <header className="sticky top-0 z-50 w-full bg-[#050b11]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/nexu.png" alt="NEXU" className="h-7 w-auto object-contain" />
              <div className="hidden sm:block h-4 w-px bg-white/10 mx-3" />
              <span className="hidden sm:block text-[9px] font-black text-nexus-text uppercase tracking-[0.4em] italic opacity-80">Powered by Predictive IA</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-nexus-text hover:text-white transition-colors">
              Regresar a la Terminal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col gap-20">
        <TermsSection />
      </main>

      {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-nexus-blue/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}

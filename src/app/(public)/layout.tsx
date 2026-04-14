import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Left Branding Presentation (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low border-r border-outline-variant/10 flex-col justify-between overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-nexus-blue/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-nexus-blue-light/10 blur-[150px] rounded-full"></div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0"></div>

        <div className="relative z-10 p-12 lg:p-16 flex-grow flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-nexus-blue/10 border border-nexus-blue-light/20 w-fit backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-nexus-blue-light animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-nexus-blue-light">Infraestructura Segura</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none text-white mb-6 uppercase">
            EL PUENTE HACIA<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-blue to-nexus-blue-light">EL ORO DIGITAL.</span>
          </h1>

          <p className="text-nexus-text text-lg leading-relaxed max-w-md font-medium">
            Gestiona tu patrimonio basado en el activo más estable de la historia. Seguridad HMAC y rendimientos automatizados para la élite financiera cripto.
          </p>
        </div>

        <div className="relative z-10 p-12 lg:p-16 flex items-center justify-between border-t border-white/5">
          <Link href="/" className="group">
            <Image
              src="/nexu.png"
              alt="NEXU"
              width={120}
              height={40}
              className="h-10 w-auto brightness-110 drop-shadow-[0_0_16px_rgba(24,136,243,0.5)] group-hover:drop-shadow-[0_0_28px_rgba(24,136,243,0.7)] transition-all"
            />
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-nexus-blue-light font-black">Protocolo de Alquimia Digital</div>
        </div>
      </div>

      {/* Right Column: Interactive Content */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile Header */}
        <header className="lg:hidden w-full sticky top-0 bg-[#111318]/80 backdrop-blur-md flex justify-center items-center px-6 py-4 z-50 border-b border-outline-variant/5">
          <Link href="/" className="group">
            <Image
              src="/nexu.png"
              alt="NEXU"
              width={120}
              height={40}
              className="h-9 w-auto brightness-110 drop-shadow-[0_0_14px_rgba(24,136,243,0.5)] group-hover:drop-shadow-[0_0_24px_rgba(24,136,243,0.7)] transition-all"
            />
          </Link>
        </header>

        {/* Background Decorative Elements for Mobile */}
        <div className="lg:hidden fixed top-0 right-0 -z-10 w-64 h-64 bg-primary-fixed opacity-[0.05] blur-[120px] rounded-full"></div>

        <main className="flex-grow flex flex-col justify-center w-full relative z-10">
          {children}
        </main>

        {/* Mobile Footer */}
        <footer className="lg:hidden w-full py-8 text-center mt-auto">
           <div className="font-manrope text-[10px] tracking-widest uppercase text-gray-600 opacity-50">
            © 2024 NEXU ALCHEMY. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </footer>
      </div>
    </div>
  );
}

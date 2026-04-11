'use client';

import { Shield, Target, Smartphone, Globe } from 'lucide-react';

export function AboutSection() {
  const cards = [
    {
      title: 'El Puente Digital al Oro',
      desc: 'NEXU es el protocolo fintech que transforma tus activos digitales en solidez física. Invertimos en oro de alta fidelidad mediante ejecuciones asistidas por IA.',
      icon: Target,
      className: 'lg:col-span-2'
    },
    {
      title: 'Intermediación Protegida',
      desc: 'No necesitas ser experto. Actuamos como el nexo seguro entre tú y los mercados más complejos.',
      icon: Shield,
      className: 'lg:col-span-1'
    },
    {
      title: 'Tecnología HMAC',
      desc: 'Toda la comunicación de red y validación de operaciones está cifrada bajo estándares de seguridad bancaria.',
      icon: Smartphone,
      className: 'lg:col-span-1'
    },
    {
      title: 'Visión Global',
      desc: 'Un futuro donde el capital digital fluye libremente hacia el activo más estable de la historia humana.',
      icon: Globe,
      className: 'lg:col-span-2'
    }
  ];

  return (
    <section id="quienes-somos" className="space-y-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-blue-light mb-4">Misión del Protocolo</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            QUIÉNES SOMOS EN EL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-blue to-white/60">NÚCLEO DE NEXU.</span>
          </h3>
        </div>
        <p className="max-w-md text-nexus-text text-sm font-medium leading-relaxed italic opacity-60">
          "Democratizando la estabilidad del oro a través de la infraestructura descentralizada de nueva generación."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`glass-card p-8 group hover:border-nexus-blue/30 transition-all duration-500 relative overflow-hidden bg-white/[0.01] ${card.className}`}
          >
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-nexus-blue transition-all duration-700"></div>
            <card.icon className="w-8 h-8 text-nexus-blue-light opacity-50 mb-6 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{card.title}</h4>
            <p className="text-sm text-nexus-text/80 leading-relaxed font-medium">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

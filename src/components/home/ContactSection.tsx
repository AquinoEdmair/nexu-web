'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Send, ShieldCheck } from 'lucide-react';

export function ContactSection() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:aquinoedmair@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(description)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contacto" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-20 border-t border-white/5">
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-blue-light">Sede de Operaciones</h2>
          <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            ESTAMOS EN <br /> <span className="text-nexus-blue">EL CENTRO.</span>
          </h3>
          <p className="text-nexus-text font-medium leading-relaxed">
            Nuestra infraestructura física está estratégicamente ubicada en los centros financieros de mayor crecimiento para garantizar la conectividad de red necesaria.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-nexus-blue/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-nexus-blue/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-nexus-blue-light" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Dirección Física</h4>
              <p className="text-sm font-black text-white leading-tight uppercase tracking-widest italic font-mono">
                780 5th Ave S suite 200,<br /> Naples, FL 34102, Estados Unidos
              </p>
            </div>
          </div>

          <a 
            href="tel:+14708269616"
            className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-nexus-blue/20 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-nexus-blue/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-nexus-blue-light" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Línea de Enlace</h4>
              <p className="text-sm font-black text-white leading-tight uppercase tracking-[0.5em] italic font-mono">
                +1 470 826 9616
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="lg:col-span-7 h-full">
        <div className="glass-card p-1 relative overflow-hidden bg-gradient-to-br from-nexus-blue/10 to-transparent">
          <form 
            onSubmit={handleSubmit}
            className="bg-[#0a0c10] p-8 lg:p-10 rounded-[1.5rem] border border-white/5 space-y-8 relative z-20"
          >
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <Mail className="w-5 h-5 text-nexus-blue-light" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Protocolo de Enlace Directo</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Asunto del Mensaje</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="INCIDENCIA TÉCNICA / CONSULTA DEPÓSITO"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Descripción Detallada</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ESCRIBE AQUÍ TU SOLICITUD DE SOPORTE..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-nexus-blue text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-nexus-blue-light hover:shadow-[0_0_30px_rgba(11,64,193,0.3)] transition-all flex items-center justify-center gap-4 group"
            >
              Enviar Mensaje al Nodo
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <div className="pt-4 flex items-center justify-center gap-2 text-nexus-text/40 italic">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">Cifrado HMAC Activo en Salida</span>
            </div>
          </form>

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[#0a0c10] grid grid-cols-12 grid-rows-12 opacity-[0.03] pointer-events-none">
             {[...Array(144)].map((_, i) => (
                <div key={i} className="border-[0.5px] border-nexus-blue"></div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}


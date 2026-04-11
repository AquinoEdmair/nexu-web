'use client';

import { FileText, ShieldCheck, ScrollText } from 'lucide-react';

export function TermsSection() {
  return (
    <section id="terminos" className="space-y-12 pt-20 border-t border-white/5 pb-20">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <FileText className="w-4 h-4 text-nexus-blue" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-text">Base Legal del Protocolo</span>
        </div>
        <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Términos y Condiciones</h3>
        <p className="max-w-2xl mx-auto text-nexus-text font-medium text-sm leading-relaxed">
          Lea cuidadosamente los protocolos de uso de la terminal NEXU. Al interactuar con el sistema, usted acepta los siguientes términos de operación y seguridad.
        </p>
      </div>

      <div className="max-w-4xl mx-auto h-[500px] glass-card bg-white/[0.01] p-8 lg:p-12 overflow-y-auto custom-scrollbar border-white/5 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ScrollText className="w-32 h-32 text-nexus-blue" />
        </div>
        
        <div className="space-y-10 text-[13px] text-nexus-text/80 font-medium leading-[1.8] tracking-tight uppercase italic indent-8">
          <div className="space-y-4">
            <h4 className="text-white font-black tracking-widest text-[11px] uppercase">[01. NATURALEZA DEL PROTOCOLO]</h4>
            <p>
              NEXU ES UNA PLATAFORMA FINTECH DISEÑADA PARA LA INTERMEDIACIÓN Y GESTIÓN DE ACTIVOS DIGITALES BASADOS EN ORO. AL UTILIZAR EL SISTEMA, USTED RECONOCE QUE NEXU ACTÚA COMO INTERMEDIARIO SEGURO Y QUE LOS RENDIMIENTOS SON GENERADOS POR SISTEMAS EXTERNOS DE TRADING ASISTIDO POR IA.
            </p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">[02. SEGURIDAD Y TOKENIZACIÓN]</h4>
             <p>
               USTED ES EL ÚNICO RESPONSABLE DE LA CUSTODIA DE SUS CREDENCIALES DE ACCESO. TODA OPERACIÓN VALIDADA MEDIANTE SU TOKEN DE SESIÓN SE CONSIDERARÁ AUTORIZADA POR EL TITULAR. NEXU SE RESERVA EL DERECHO DE SUSPENDER ACCESOS BAJO SOSPECHA DE ACTIVIDAD ANÓMALA O ATAQUES DE FUERZA BRUTA.
             </p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">[03. LIQUIDÉZ Y RETIROS]</h4>
             <p>
               LAS SOLICITUDES DE RETIRO SE PROCESAN MEDIANTE PROTOCOLOS DE VERIFICACIÓN MANUAL PARA GARANTIZAR LA INTEGRIDAD DEL CAPITAL. LOS TIEMPOS DE EJECUCIÓN PUEDEN VARIAR SEGÚN LA RED BLOCKCHAIN SELECCIONADA Y LOS PROCESOS DE SEGURIDAD INTERNOS.
             </p>
          </div>

          <div className="space-y-4">
             <h4 className="text-white font-black tracking-widest text-[11px] uppercase">[04. RIESGOS OPERATIVOS]</h4>
             <p>
               LA INVERSIÓN EN ACTIVOS DIGITALES CONLLEVA RIESGOS INHERENTES A LA VOLATILIDAD DEL MERCADO. NEXU NO SE HACE RESPONSABLE POR PÉRDIDAS DERIVADAS DE FLUCTUACIONES EXTREMAS EN EL SISTEMA DE TRADING EXTERNO O FALLOS EN LAS REDES DE COMUNICACIÓN GLOBALES.
             </p>
          </div>

          {/* User message placeholder note */}
          <div className="p-6 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl flex items-center gap-4 text-nexus-blue-light animate-pulse">
             <ShieldCheck className="w-6 h-6 shrink-0" />
             <span className="text-[10px] font-black tracking-[0.2em] italic">ESPACIO PARA TEXTO DEFINITIVO ADICIONAL - ARCHIVO EN ESPERA DE SINCRONIZACIÓN FINAL</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-nexus-text/30 uppercase tracking-[0.5em]">Última Actualización del Registro: 11.04.2026</p>
      </div>
    </section>
  );
}

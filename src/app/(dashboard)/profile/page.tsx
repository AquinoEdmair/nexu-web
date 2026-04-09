'use client';

import React from 'react';
import { Pencil, Lock, Key, BellRing, AtSign, ShieldCheck, User, Settings, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Identidad Operativa</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Gestión de Perfil</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Configuración del protocolo de identidad y capas de seguridad.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <CheckCircle className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo KYC: Verificado</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Hero profile & Actions */}
        <aside className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          {/* Identity Hub Section */}
          <section className="flex flex-col items-center bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-nexus-blue/20 transition-all">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-nexus-blue/5 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10">
              <div className="relative group/avatar">
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-nexus-blue-light/20 p-2 bg-white/5 group-hover/avatar:border-nexus-blue-light/50 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-nexus-blue/10 flex items-center justify-center">
                    <User className="w-16 h-16 text-nexus-blue-light/40" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-nexus-blue hover:bg-nexus-blue-light text-white p-3.5 rounded-2xl shadow-[0_4px_15px_rgba(11,64,193,0.4)] active:scale-95 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Alexander Vault</h2>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-nexus-blue-light text-[10px] font-black tracking-[0.3em] uppercase">Rango: Operador Elite</span>
                </div>
                
                <div className="mt-2 flex items-center justify-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-nexus-blue-light animate-pulse shadow-[0_0_10px_rgba(24,136,243,1)]"></div>
                  <span className="text-[9px] text-white/50 font-black tracking-widest uppercase">Estatus Operativo: Nominal</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2FA Command Panel */}
          <section className="space-y-4">
            <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase pl-1">Seguridad de Protocolo</h3>
            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 backdrop-blur-xl group hover:border-nexus-blue/20 transition-all">
              <ShieldCheck className="w-10 h-10 text-nexus-blue-light/30 group-hover:text-nexus-blue-light transition-colors" />
              <div className="space-y-1">
                <p className="text-xs font-black text-white uppercase tracking-widest">Doble Factor (2FA)</p>
                <p className="text-[10px] font-black tracking-widest text-nexus-blue-light/40 uppercase">Módulo en Sincronización</p>
              </div>
            </div>
          </section>
        </aside>

        {/* Right Column: Info & Preferences */}
        <section className="lg:col-span-7 space-y-10">
          {/* Identity Protocol Information */}
          <div className="space-y-5">
            <div className="flex justify-between items-end px-1">
              <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">Protocolo de Registro</h3>
              <span className="text-[10px] text-nexus-blue-light font-black tracking-widest border-b border-nexus-blue-light/20">ID: NEXU-9921-X</span>
            </div>
            
            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] p-10 space-y-10 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Alias Operativo</label>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-nexus-blue/20 transition-colors">
                    <p className="text-sm font-black text-white tracking-tighter uppercase">Alexander Vault</p>
                  </div>
                </div>
                
                <div className="space-y-2 opacity-60">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Nodo de Contacto</label>
                  <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-sm font-black text-white/40 tracking-tighter">alex.v@nexus.io</p>
                    <Lock className="w-4 h-4 text-white/10" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Línea Segura</label>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-nexus-blue/20 transition-colors">
                  <p className="text-sm font-black text-white tracking-tighter">+1 (555) 808-2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Command */}
          <div className="space-y-5">
            <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase px-1">Cifrado de Acceso</h3>
            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl p-8 flex flex-wrap gap-6 items-center justify-between backdrop-blur-xl hover:border-nexus-blue/20 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-nexus-blue-light border border-white/5 group-hover:bg-nexus-blue/10 transition-colors">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Llave de Infraestructura</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Último cambio: Hace 45 ciclos</p>
                </div>
              </div>
              <button className="bg-white/5 hover:bg-nexus-blue text-nexus-blue-light hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-nexus-blue/20 flex items-center gap-2">
                Actualizar Llave
              </button>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="space-y-5">
            <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase px-1">Sincronización de Interfaz</h3>
            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              {[
                { icon: BellRing, title: 'Notificaciones Push', desc: 'Alertas de movimientos en red', active: true },
                { icon: AtSign, title: 'Marketing por Correo', desc: 'Actualizaciones de infraestructura', active: false },
              ].map((pref, i) => (
                <div key={i} className={`p-8 flex items-center justify-between transition-colors hover:bg-white/[0.02] ${i === 0 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <pref.icon className="w-5 h-5 text-nexus-blue-light/40" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white uppercase tracking-widest block mb-0.5">{pref.title}</span>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{pref.desc}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${pref.active ? 'bg-nexus-blue' : 'bg-white/5 border border-white/5'}`}>
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${pref.active ? 'bg-white translate-x-6' : 'bg-white/20'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Command */}
          <div className="pt-6">
            <button className="w-full bg-nexus-blue hover:bg-nexus-blue-light text-white py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-xs shadow-[0_10px_30px_rgba(11,64,193,0.3)] hover:shadow-[0_15px_40px_rgba(24,136,243,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 group/save">
               Sincronizar Protocolo de Identidad
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
    </main>
  );
}


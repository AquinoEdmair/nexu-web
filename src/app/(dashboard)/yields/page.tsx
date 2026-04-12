'use client';

import React, { useState } from 'react';
import { TrendingUp, Download, Cpu, Activity, ShieldCheck, Zap, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useYields } from '@/lib/hooks/useYields';
import { useBalance } from '@/lib/hooks/useBalance';
import { useInvestment } from '@/lib/hooks/useInvestment';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function YieldsPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: yieldsData, isLoading: yieldsLoading } = useYields(page);
  const { data: balanceData, isLoading: balanceLoading } = useBalance();
  const { mutate: invest, isPending: investing, error: investError } = useInvestment();

  const history = yieldsData?.data || [];
  const monthlyYield = history.reduce((acc, curr) => acc + parseFloat(curr.amount_applied), 0);
  const totalInOperation = balanceData?.data?.balance_in_operation || '0';
  const availableBalance = parseFloat(balanceData?.data?.balance_available || '0');

  const handleInvest = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || numAmount > availableBalance) return;
    invest(numAmount, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setAmount('');
        }, 2000);
      },
    });
  };

  const handleOpenModal = () => {
    setSuccess(false);
    setAmount('');
    setShowModal(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Rendimientos Gestionados</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Control de Rendimientos</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Análisis y proyección de crecimiento de capital respaldado en oro.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Protección de Bóveda Activa</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Generator Stats */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
          <section className="relative overflow-hidden rounded-3xl p-8 bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] group hover:border-nexus-blue/30 transition-all">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-nexus-blue/5 rounded-full blur-3xl group-hover:bg-nexus-blue/10 transition-colors"></div>
            
            <div className="relative z-10 space-y-2">
              <p className="text-nexus-blue-light/40 font-black text-[9px] tracking-[0.3em] uppercase">
                Balance en Operación
              </p>
              <div className="flex items-baseline gap-2">
                {balanceLoading ? (
                  <div className="h-12 w-32 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <h2 className="text-5xl font-black text-white tracking-tighter">{formatCurrency(totalInOperation)}</h2>
                )}
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-nexus-blue/10 border border-nexus-blue/20">
                <Activity className="w-3 h-3 text-nexus-blue-light" />
                <span className="text-nexus-blue-light text-[10px] font-black uppercase tracking-widest">Rendimientos en Tiempo Real</span>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-blue/20 transition-all">
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">
                  Rendimiento del Periodo
                </p>
                <div className="flex items-end justify-between">
                   {yieldsLoading ? (
                     <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                   ) : (
                     <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(monthlyYield)}</p>
                   )}
                   <div className="flex items-center gap-1 text-[10px] text-nexus-blue-light font-black mb-1">
                      <TrendingUp className="w-3 h-3" />
                      ACTIVO
                   </div>
                </div>
              </div>

              {/* CTA: Invertir */}
              <button
                onClick={handleOpenModal}
                disabled={availableBalance <= 0 || balanceLoading}
                className="mt-4 w-full relative group/btn flex items-center justify-between px-5 py-4 rounded-2xl bg-nexus-blue hover:bg-nexus-blue-light disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(11,64,193,0.4)] border border-nexus-blue-light/20"
              >
                <div className="text-left">
                  <p className="text-white font-black text-xs uppercase tracking-widest">Invertir Capital</p>
                  <p className="text-white/50 text-[9px] font-black uppercase tracking-wider mt-0.5">
                    Disponible: {formatCurrency(availableBalance.toString())} USD
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Projection Visualizer */}
          <section className="p-8 rounded-3xl bg-[#0a0f16]/40 border border-white/10 backdrop-blur-xl group hover:border-nexus-blue/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                Gráfica de Rendimiento
              </h3>
              <Activity className="w-4 h-4 text-nexus-blue-light/20 group-hover:animate-pulse" />
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="yieldChartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1888F3" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#1888F3" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,75 100,60 T200,50 T300,35 T400,15 L400,100 L0,100 Z" fill="url(#yieldChartGradient)"></path>
                <path d="M0,80 Q50,75 100,60 T200,50 T300,35 T400,15" fill="none" stroke="#1888F3" strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(24,136,243,0.5)]"></path>
              </svg>
            </div>
            <div className="flex justify-between mt-4">
               {['0%', '50%', '100%'].map(mark => (
                 <span key={mark} className="text-[8px] text-white/20 font-black">{mark}</span>
               ))}
            </div>
          </section>
        </aside>

        {/* Right Column: Historical Ledger */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Historial de Rendimientos</h2>
            <button className="text-[10px] text-nexus-blue-light font-black tracking-widest uppercase flex items-center gap-2 px-4 py-2 bg-nexus-blue/5 border border-nexus-blue/10 rounded-xl hover:bg-nexus-blue hover:text-white transition-all">
              Exportar Registro <Download className="w-3 h-3" />
            </button>
          </div>
          
          <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto min-w-[600px]">
              <div className="grid grid-cols-12 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 border-b border-white/10 bg-white/5">
                <div className="col-span-4">Marca Temporal</div>
                <div className="col-span-4 text-center">Rendimiento Aplicado</div>
                <div className="col-span-4 text-right">Balance de Capital</div>
              </div>
              
              {yieldsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-8 py-6 border-b border-white/5 animate-pulse">
                    <div className="col-span-4 space-y-2">
                      <div className="h-3 w-20 bg-white/10 rounded" />
                      <div className="h-2 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="col-span-4 flex flex-col items-center gap-1">
                      <div className="h-4 w-12 bg-white/10 rounded" />
                      <div className="h-2 w-16 bg-white/5 rounded" />
                    </div>
                    <div className="col-span-4 flex flex-col items-end gap-1">
                      <div className="h-2 w-12 bg-white/5 rounded" />
                      <div className="h-4 w-20 bg-white/10 rounded" />
                    </div>
                  </div>
                ))
              ) : history.length > 0 ? (
                history.map((row) => (
                  <div key={row.id} className="grid grid-cols-12 items-center px-8 py-6 hover:bg-white/[0.02] transition-colors border-b border-white/5 group">
                    <div className="col-span-4 space-y-2">
                      <p className="text-xs font-black text-white tracking-tighter uppercase">
                        {formatDate(row.created_at)}
                      </p>
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase bg-white/5 border-white/5 text-white/30`}>
                        {row.yield_log?.description || 'RENDIMIENTO DE BÓVEDA'}
                      </span>
                    </div>
                    <div className="col-span-4 text-center space-y-1">
                      <p className="text-base font-black text-nexus-blue-light tracking-tighter">
                        {parseFloat(row.amount_applied) >= 0 ? '+' : ''}{formatCurrency(row.amount_applied)}
                      </p>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        GENERADO POR {row.yield_log?.type || 'NEXU'}
                      </p>
                    </div>
                    <div className="col-span-4 text-right space-y-1">
                      <p className="text-[10px] text-white/10 font-black line-through tracking-widest">
                        {formatCurrency(row.balance_before)}
                      </p>
                      <p className="text-sm font-black text-white tracking-tighter">
                        {formatCurrency(row.balance_after)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-20 text-center">
                   <p className="text-white/20 font-black uppercase tracking-widest text-xs">No se han detectado registros en el historial</p>
                 </div>
              )}
            </div>
            
            {/* Pagination Controls */}
            {yieldsData && yieldsData.last_page > 1 && (
              <div className="flex justify-center items-center gap-4 py-6 border-t border-white/5 bg-white/[0.02]">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Anterior
                </button>
                <span className="text-[10px] font-black text-nexus-blue-light">PÁGINA {page} / {yieldsData.last_page}</span>
                <button 
                  onClick={() => setPage(p => Math.min(yieldsData.last_page, p + 1))}
                  disabled={page === yieldsData.last_page}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modern Investment Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-[#05080c]/80 backdrop-blur-md"
            onClick={() => !investing && !success && setShowModal(false)}
          ></div>
          
          <div className="relative w-full max-w-md bg-[#0a0f16] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Nueva Inversión</h3>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Protocolo de Movimiento Interno</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                disabled={investing || success}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {success ? (
                <div className="py-10 flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-nexus-blue-light/10 border border-nexus-blue-light/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-nexus-blue-light animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest">Operación Exitosa</h4>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-2 px-10 leading-relaxed">
                      Tu capital ha sido inyectado al balance en operación correctamente.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Amount Input Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Monto a Inyectar</label>
                      <span className="text-[9px] font-black text-nexus-blue-light uppercase tracking-widest">USD (USDT)</span>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <span className="text-xl font-black text-white/20">$</span>
                      </div>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={investing}
                        className="w-full bg-white/5 border border-white/10 focus:border-nexus-blue/50 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-white placeholder:text-white/5 outline-none transition-all"
                      />
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      {[0.25, 0.5, 1].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setAmount((availableBalance * pct).toFixed(2))}
                          disabled={investing || availableBalance <= 0}
                          className="py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-nexus-blue-light/30 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                        >
                          {pct === 1 ? 'MAX' : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-2xl bg-nexus-blue/5 border border-nexus-blue/10 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">Saldo Disponible</span>
                      <span className="text-white">{formatCurrency(availableBalance.toString())} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-3 border-t border-white/5">
                      <span className="text-nexus-blue-light">Nuevo Balance Operativo</span>
                      <span className="text-nexus-blue-light">
                        {formatCurrency((parseFloat(totalInOperation) + (parseFloat(amount) || 0)).toString())} USD
                      </span>
                    </div>
                  </div>

                  {investError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        {(investError as any)?.response?.data?.message || 'Error en la transacción'}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleInvest}
                    disabled={investing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                    className="w-full py-5 rounded-2xl bg-white text-[#05080c] font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-20 disabled:active:scale-100 transition-all flex items-center justify-center gap-3 group"
                  >
                    {investing ? (
                      <Activity className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Confirmar Inversión
                        <Zap className="w-3 h-3 fill-current group-hover:animate-pulse" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Safety Notice */}
            {!success && (
              <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-nexus-blue-light opacity-50" />
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                  Transacción protegida por cifrado de bóveda NEXU v2.1
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}


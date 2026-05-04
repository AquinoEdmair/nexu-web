'use client';

import { useBalance } from '@/lib/hooks/useBalance';
import { useWithdrawalCurrencies } from '@/lib/hooks/useWithdrawalCurrencies';
import { formatCurrency } from '@/lib/utils/format';
import { Wallet, Info, ArrowUpRight, Calendar, ArrowRight, ShieldCheck, Database, Zap, FileText } from 'lucide-react';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import { WithdrawalForm } from './WithdrawalForm';

export function WithdrawalDashboard() {
  const { data: balanceData } = useBalance();
  const balance = balanceData?.data;
  
  const inOperation = balance?.balance_in_operation ?? '0';
  const availableBalance = (balance as any)?.balance_available ?? inOperation;
  const activatingBalance = (balance as any)?.balance_activating ?? '0';
  const totalBalance = balance?.balance_total ?? '0';

  // Mock data for the activations table
  const mockActivations = [
    { id: 1, date: '20 Abr 2025 - 10:30 AM', type: 'Depósito', amount: '1000.00', period: '30 días', availableIn: '02 May 2025', daysLeft: 12, color: 'nexus-blue' },
    { id: 2, date: '17 Abr 2025 - 08:15 AM', type: 'Rendimiento', amount: '350.00', period: '7 días', availableIn: '24 Abr 2025', daysLeft: 4, color: 'green-400' },
    { id: 3, date: '20 Abr 2025 - 11:45 AM', type: 'Comisión referido', amount: '120.00', period: '3 días', availableIn: '22 Abr 2025', daysLeft: 2, color: 'amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Disponible */}
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-white/40" />
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              Disponible para retiro <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-black text-white tracking-tighter">${formatCurrency(availableBalance)}</span>
            <span className="text-xs font-black text-nexus-blue-light uppercase px-2 py-1 bg-nexus-blue/10 rounded-lg border border-nexus-blue/20 mb-1">
              USDT (TRC 20)
            </span>
          </div>
          <p className="text-[10px] text-white/40">Este monto está listo para ser retirado ahora.</p>
        </div>

        {/* Card 2: En activacion */}
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full" />
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              En activación total <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-black text-amber-500 tracking-tighter">${formatCurrency(activatingBalance)}</span>
          </div>
          <p className="text-[10px] text-white/40">Fondos que se habilitarán próximamente.</p>
        </div>

        {/* Card 3: Total */}
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-white/40" />
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              Total de fondos <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-black text-white tracking-tighter">${formatCurrency(totalBalance)}</span>
          </div>
          <p className="text-[10px] text-white/40">Suma de disponible + en activación.</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-4 p-4 bg-nexus-blue/5 border border-nexus-blue/20 rounded-2xl">
        <div className="p-2 bg-nexus-blue/10 rounded-full border border-nexus-blue/20 shrink-0">
          <Info className="w-4 h-4 text-nexus-blue-light" />
        </div>
        <div>
          <h4 className="text-xs font-black text-nexus-blue-light mb-1">Activación de fondos</h4>
          <p className="text-[10px] text-nexus-blue-light/70 leading-relaxed">
            Los fondos se habilitan progresivamente tras su integración en el sistema operativo.<br/>
            Cada tipo de saldo cuenta con un periodo de activación específico que garantiza la correcta ejecución y estabilidad de las operaciones.
          </p>
        </div>
      </div>

      {/* Disponibilidad por origen */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-nexus-blue-light rounded-full" />
          <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-1.5">
            Disponibilidad por origen <Info className="w-3 h-3 text-white/20" />
          </h3>
        </div>
        <p className="text-[10px] text-white/40">Cada tipo de fondo tiene un periodo de activación diferente antes de estar disponible para retiro.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Capital */}
          <div className="bg-[#0a0f16]/40 border border-nexus-blue/20 rounded-2xl p-5 hover:border-nexus-blue/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-nexus-blue/10 rounded-xl">
                <Wallet className="w-4 h-4 text-nexus-blue-light" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">Capital (Depósitos)</h4>
                <p className="text-[9px] text-white/40">Total en activación</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-black text-nexus-blue-light tracking-tighter">$1,000.00</span>
              <span className="text-[9px] font-black text-nexus-blue-light uppercase tracking-widest bg-nexus-blue/10 px-2 py-1 rounded-lg">Activación: 30 días</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Próxima disponibilidad</span>
                <span className="text-white">02 May 2025</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-nexus-blue-light">12 días</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-nexus-blue-light rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <button className="w-full flex items-center justify-between text-[10px] font-black text-white/40 hover:text-white pt-4 border-t border-white/5 transition-colors group">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> 1 depósito en activación</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Rendimientos */}
          <div className="bg-[#0a0f16]/40 border border-green-500/20 rounded-2xl p-5 hover:border-green-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest">Rendimientos (Trading)</h4>
                <p className="text-[9px] text-white/40">Total en activación</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-black text-green-400 tracking-tighter">$350.00</span>
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-lg">Activación: 7 días</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Próxima disponibilidad</span>
                <span className="text-white">24 Abr 2025</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-green-400">4 días</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <button className="w-full flex items-center justify-between text-[10px] font-black text-white/40 hover:text-white pt-4 border-t border-white/5 transition-colors group">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Rendimientos generados</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Comisiones */}
          <div className="bg-[#0a0f16]/40 border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Comisiones (Referidos)</h4>
                <p className="text-[9px] text-white/40">Total en activación</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-black text-amber-400 tracking-tighter">$120.00</span>
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-lg">Activación: 3 días</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Próxima disponibilidad</span>
                <span className="text-white">22 Abr 2025</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-amber-400">2 días</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <button className="w-full flex items-center justify-between text-[10px] font-black text-white/40 hover:text-white pt-4 border-t border-white/5 transition-colors group">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Comisiones por referidos</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section: Split into 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Left Column: Detalle de activaciones */}
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-6">Detalle de Activaciones</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30">Fecha</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30">Origen</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Monto</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-center">Periodo</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Disponible en</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockActivations.map((act) => (
                  <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-[10px] text-white/60 font-medium">{act.date}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${act.color}`} />
                        <span className="text-[10px] text-white font-medium">{act.type}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] font-black text-${act.color}`}>${act.amount}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-[10px] text-white/40">{act.period}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-nexus-blue-light font-medium">{act.availableIn}</span>
                        <span className="text-[9px] text-white/40">({act.daysLeft} días)</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <button className="text-[10px] font-black text-nexus-blue-light hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5 group">
              Ver historial completo <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 flex gap-4 p-4 bg-nexus-blue/5 border border-nexus-blue/15 rounded-2xl">
            <ShieldCheck className="h-5 w-5 shrink-0 text-nexus-blue-light" />
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Las solicitudes son validadas manualmente bajo protocolo HMAC.</p>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Recibirás notificación tras la confirmación. El proceso puede tomar hasta 48 horas hábiles.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Withdrawal Form */}
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-3 bg-nexus-blue-light rounded-full" />
            <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-1.5">
              Monto de retiro <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <WithdrawalForm availableBalance={availableBalance} />
        </div>
      </div>
    </div>
  );
}

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

      {/* Main Content: Split into columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* Left Column: Security Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0f16]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col justify-center">
            <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">Proceso de Retiro</h3>
            <p className="text-[10px] text-white/50 leading-relaxed mb-8">
              Ingresa el monto que deseas retirar de tu saldo disponible. 
              Asegúrate de proporcionar una dirección de wallet válida en la red correspondiente y de verificarla dos veces para evitar pérdidas de fondos.
            </p>
            
            <div className="flex gap-4 p-4 bg-nexus-blue/5 border border-nexus-blue/15 rounded-2xl">
              <ShieldCheck className="h-5 w-5 shrink-0 text-nexus-blue-light" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Validación HMAC Segura</p>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Las solicitudes de retiro son procesadas y validadas manualmente bajo estrictos protocolos de seguridad HMAC.
                  El proceso de liquidación puede tomar hasta 48 horas hábiles tras la confirmación de la solicitud.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Withdrawal Form */}
        <div className="lg:col-span-7 bg-[#0a0f16]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
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

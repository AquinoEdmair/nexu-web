'use client';

import { useBalance } from '@/lib/hooks/useBalance';
import { useActivatingTransactions } from '@/lib/hooks/useActivatingTransactions';
import type { ActivatingTransaction } from '@/lib/hooks/useActivatingTransactions';
import { formatCurrency } from '@/lib/utils/format';
import {
  Wallet, Info, ArrowUpRight, Calendar, ArrowRight, ShieldCheck,
  Database, FileText, Loader2, Clock,
} from 'lucide-react';
import { WithdrawalForm } from './WithdrawalForm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
}

const TYPE_CONFIG = {
  deposit:             { label: 'Depósito',          color: 'text-nexus-blue-light', dot: 'bg-nexus-blue-light', border: 'border-nexus-blue/20', badge: 'bg-nexus-blue/10 text-nexus-blue-light' },
  yield:               { label: 'Rendimiento',        color: 'text-green-400',        dot: 'bg-green-400',        border: 'border-green-500/20', badge: 'bg-green-500/10 text-green-400' },
  referral_commission: { label: 'Comisión referido',  color: 'text-amber-400',        dot: 'bg-amber-400',        border: 'border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400' },
  commission:          { label: 'Comisión',           color: 'text-amber-400',        dot: 'bg-amber-400',        border: 'border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400' },
};

function OriginCard({
  label, icon, totalActivating, nextAvailableAt, daysLeft, count, colorClass, borderClass, badgeClass,
}: {
  label: string;
  icon: React.ReactNode;
  totalActivating: string;
  nextAvailableAt: string | null;
  daysLeft: number | null;
  count: number;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
}) {
  const hasActivating = parseFloat(totalActivating) > 0;

  return (
    <div className={`bg-[#0a0f16]/40 border ${borderClass} rounded-2xl p-5 hover:opacity-90 transition-opacity`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/5 rounded-xl">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${colorClass}`}>{label}</h4>
          <p className="text-[9px] text-white/40">Total en activación</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-2xl font-black tracking-tighter ${hasActivating ? colorClass : 'text-white/20'}`}>
          ${formatCurrency(totalActivating)}
        </span>
        {hasActivating && nextAvailableAt && (
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${badgeClass}`}>
            {daysLeft === 0 ? 'Disponible hoy' : `${daysLeft} días restantes`}
          </span>
        )}
      </div>

      {hasActivating && nextAvailableAt ? (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/40">Próxima disponibilidad</span>
            <span className={`font-medium ${colorClass}`}>{formatDate(nextAvailableAt)}</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`}
              style={{ width: daysLeft != null && daysLeft <= 30 ? `${Math.max(5, 100 - (daysLeft / 30) * 100)}%` : '10%' }}
            />
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-white/30 mb-4">Sin fondos en activación actualmente.</p>
      )}

      <div className="flex items-center gap-1.5 pt-4 border-t border-white/5 text-[9px] font-black text-white/30 uppercase tracking-widest">
        <Calendar className="w-3 h-3" />
        {count === 0 ? 'Sin transacciones en activación' : `${count} transacción${count !== 1 ? 'es' : ''} en activación`}
      </div>
    </div>
  );
}

function ActivationRow({ tx }: { tx: ActivatingTransaction }) {
  const cfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.commission;
  return (
    <tr className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
      <td className="py-4 text-[10px] text-white/50">{formatDateTime(tx.created_at)}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className="text-[10px] text-white font-medium">{cfg.label}</span>
        </div>
      </td>
      <td className="py-4 text-right">
        <span className={`text-[10px] font-black ${cfg.color}`}>${formatCurrency(tx.net_amount)}</span>
      </td>
      <td className="py-4 text-right">
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-medium ${cfg.color}`}>{formatDate(tx.available_at)}</span>
          <span className="text-[9px] text-white/40 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {tx.daysLeft === 0 ? 'Disponible hoy' : `${tx.daysLeft} día${tx.daysLeft !== 1 ? 's' : ''}`}
          </span>
        </div>
      </td>
    </tr>
  );
}

export function WithdrawalDashboard() {
  const { data: balanceData } = useBalance();
  const { data: activation, isLoading: loadingActivation } = useActivatingTransactions();

  const balance = balanceData?.data;
  const inOperation = balance?.balance_in_operation ?? '0';
  const availableBalance = (balance as any)?.balance_available ?? inOperation;
  const activatingBalance = (balance as any)?.balance_activating ?? '0';
  const totalBalance = balance?.balance_total ?? '0';

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-white/40" />
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              Disponible para retiro <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-black text-white tracking-tighter">${formatCurrency(availableBalance)}</span>
            <span className="text-xs font-black text-nexus-blue-light uppercase px-2 py-1 bg-nexus-blue/10 rounded-lg border border-nexus-blue/20 mb-1">USDT</span>
          </div>
          <p className="text-[10px] text-white/40">Este monto está listo para ser retirado ahora.</p>
        </div>

        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3 bg-amber-500 rounded-full" />
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              En activación total <Info className="w-3 h-3 text-white/20" />
            </h3>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-black text-amber-500 tracking-tighter">${formatCurrency(activatingBalance)}</span>
          </div>
          <p className="text-[10px] text-white/40">Fondos que se habilitarán próximamente.</p>
        </div>

        <div className="bg-[#0a0f16]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
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
            Los fondos se habilitan progresivamente tras su integración en el sistema operativo.<br />
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

        {loadingActivation ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <Loader2 className="w-5 h-5 text-nexus-blue-light animate-spin" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Cargando activaciones...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OriginCard
              label="Capital (Depósitos)"
              icon={<Wallet className="w-4 h-4 text-nexus-blue-light" />}
              totalActivating={activation?.deposit.total ?? '0'}
              nextAvailableAt={activation?.deposit.nextAvailableAt ?? null}
              daysLeft={activation?.deposit.daysLeft ?? null}
              count={activation?.deposit.count ?? 0}
              colorClass="text-nexus-blue-light"
              borderClass="border-nexus-blue/20"
              badgeClass="bg-nexus-blue/10 text-nexus-blue-light"
            />
            <OriginCard
              label="Rendimientos (Trading)"
              icon={<ArrowUpRight className="w-4 h-4 text-green-400" />}
              totalActivating={activation?.yield.total ?? '0'}
              nextAvailableAt={activation?.yield.nextAvailableAt ?? null}
              daysLeft={activation?.yield.daysLeft ?? null}
              count={activation?.yield.count ?? 0}
              colorClass="text-green-400"
              borderClass="border-green-500/20"
              badgeClass="bg-green-500/10 text-green-400"
            />
            <OriginCard
              label="Comisiones (Referidos)"
              icon={<FileText className="w-4 h-4 text-amber-400" />}
              totalActivating={activation?.commission.total ?? '0'}
              nextAvailableAt={activation?.commission.nextAvailableAt ?? null}
              daysLeft={activation?.commission.daysLeft ?? null}
              count={activation?.commission.count ?? 0}
              colorClass="text-amber-400"
              borderClass="border-amber-500/20"
              badgeClass="bg-amber-500/10 text-amber-400"
            />
          </div>
        )}
      </div>

      {/* Bottom: Activations Table + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">

        {/* Left: Detalle de activaciones */}
        <div className="lg:col-span-5 bg-[#0a0f16]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-6">Detalle de Activaciones</h3>

          {loadingActivation ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-nexus-blue-light animate-spin" />
            </div>
          ) : activation && activation.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30">Fecha</th>
                    <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30">Origen</th>
                    <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Monto</th>
                    <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-white/30 text-right">Disponible en</th>
                  </tr>
                </thead>
                <tbody>
                  {activation.items.map((tx) => (
                    <ActivationRow key={tx.id} tx={tx} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-30">
              <Clock className="w-8 h-8 text-white" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Sin activaciones pendientes</p>
            </div>
          )}

          <div className="mt-8 flex gap-4 p-4 bg-nexus-blue/5 border border-nexus-blue/15 rounded-2xl">
            <ShieldCheck className="h-5 w-5 shrink-0 text-nexus-blue-light" />
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Validación HMAC Segura</p>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Las solicitudes son validadas manualmente. El proceso puede tomar hasta 48 horas hábiles.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
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

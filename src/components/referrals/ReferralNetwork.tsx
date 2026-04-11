'use client';

import { useState } from 'react';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReferralNetwork } from '@/lib/hooks/useReferrals';

export function ReferralNetwork() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReferralNetwork(page);

  const nodes    = data?.data ?? [];
  const lastPage = data?.meta.last_page ?? 1;
  const total    = data?.meta.total ?? 0;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
          Registro de Nodos
        </h2>
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-nexus-blue-light fill-nexus-blue-light" />
          <span className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">
            {total} referidos totales
          </span>
        </div>
      </div>

      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-nexus-blue-light border-t-transparent rounded-full animate-spin" />
          </div>
        ) : nodes.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">
              Sin referidos aún. Comparte tu código para comenzar.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">
                      Afiliado / Nodo
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60 text-center">
                      Estatus
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-nexus-blue-light/60">
                      Comisiones generadas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {nodes.map((node) => (
                    <tr key={node.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tighter uppercase">
                            {node.masked_email}
                          </span>
                          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                            Inscrito: {new Date(node.joined_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-nexus-blue-light animate-pulse shadow-[0_0_10px_rgba(24,136,243,1)]' : 'bg-white/10'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${node.status === 'active' ? 'text-nexus-blue-light' : 'text-white/20'}`}>
                            {node.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-xl font-black text-white tracking-tighter">
                          ${parseFloat(node.total_generated).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-4 px-8 py-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-white/30 hover:text-nexus-blue-light disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  {page} / {lastPage}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="p-2 text-white/30 hover:text-nexus-blue-light disabled:opacity-20 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

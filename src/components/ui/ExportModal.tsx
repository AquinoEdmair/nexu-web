'use client';

import { useState } from 'react';
import { X, Download, Loader2, FileSpreadsheet, FileText, CalendarRange } from 'lucide-react';
import { exportApi } from '@/lib/api/export';
import { downloadExcel, downloadCSV } from '@/lib/utils/exportFile';

interface ExportModalProps {
  onClose: () => void;
}

type Section = 'transactions' | 'withdrawals' | 'yields';
type Format = 'xlsx' | 'csv';
type QuickRange = 'week' | 'month' | 'quarter' | 'all';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'transactions', label: 'Transacciones' },
  { id: 'withdrawals',  label: 'Retiros' },
  { id: 'yields',       label: 'Rendimientos' },
];

function quickRangeDates(range: QuickRange): { from: string; to: string } | null {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const to = fmt(today);

  if (range === 'week') {
    const from = new Date(today);
    from.setDate(today.getDate() - 7);
    return { from: fmt(from), to };
  }
  if (range === 'month') {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: fmt(from), to };
  }
  if (range === 'quarter') {
    const from = new Date(today);
    from.setMonth(today.getMonth() - 3);
    return { from: fmt(from), to };
  }
  return null; // 'all'
}

export function ExportModal({ onClose }: ExportModalProps) {
  const [sections, setSections]   = useState<Set<Section>>(new Set(['transactions', 'withdrawals', 'yields']));
  const [format, setFormat]       = useState<Format>('xlsx');
  const [quickRange, setQuickRange] = useState<QuickRange>('all');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const toggleSection = (s: Section) => {
    setSections((prev) => {
      const next = new Set(prev);
      if (next.has(s)) {
        if (next.size === 1) return prev; // at least one must be selected
        next.delete(s);
      } else {
        next.add(s);
      }
      return next;
    });
  };

  const applyQuickRange = (range: QuickRange) => {
    setQuickRange(range);
    const dates = quickRangeDates(range);
    if (dates) {
      setDateFrom(dates.from);
      setDateTo(dates.to);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  const handleDownload = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const params: Parameters<typeof exportApi.fetch>[0] = {
        sections: [...sections].join(','),
      };
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo)   params.date_to   = dateTo;

      const data = await exportApi.fetch(params);

      const totalRows = (data.transactions?.length ?? 0) + (data.withdrawals?.length ?? 0) + (data.yields?.length ?? 0);
      if (totalRows === 0) {
        setError('No hay registros para el rango y secciones seleccionadas.');
        return;
      }

      if (format === 'xlsx') {
        downloadExcel(data, dateFrom || undefined, dateTo || undefined);
      } else {
        downloadCSV(data, dateFrom || undefined, dateTo || undefined);
      }
      onClose();
    } catch {
      setError('Error al generar el archivo. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-nexus-blue/10 rounded-xl border border-nexus-blue/20">
              <Download className="w-4 h-4 text-nexus-blue-light" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Exportar registros</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Descarga tus operaciones</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-6">
          {/* Sections */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Secciones</p>
            <div className="flex gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                    sections.has(s.id)
                      ? 'bg-nexus-blue/20 border-nexus-blue/40 text-nexus-blue-light'
                      : 'bg-white/5 border-white/5 text-white/20 hover:text-white/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick range */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
              <CalendarRange className="w-3 h-3" /> Período
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {([
                ['week',    'Semana'],
                ['month',   'Mes'],
                ['quarter', 'Trimestre'],
                ['all',     'Todo'],
              ] as [QuickRange, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => applyQuickRange(id)}
                  className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                    quickRange === id
                      ? 'bg-nexus-blue text-white border-nexus-blue shadow-[0_0_12px_rgba(11,64,193,0.3)]'
                      : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setQuickRange('all'); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-nexus-blue/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setQuickRange('all'); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none focus:border-nexus-blue/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Formato</p>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('xlsx')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                  format === 'xlsx'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-white/20 hover:text-white/50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel (.xlsx)
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                  format === 'csv'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/5 text-white/20 hover:text-white/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                CSV (.csv)
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="w-full py-4 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(11,64,193,0.3)]"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando archivo...</>
            ) : (
              <><Download className="w-4 h-4" /> Descargar {format === 'xlsx' ? 'Excel' : 'CSV'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

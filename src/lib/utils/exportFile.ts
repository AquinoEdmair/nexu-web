import * as XLSX from 'xlsx';
import type { ExportData, ExportRow } from '@/lib/api/export';

const SHEET_LABELS: Record<string, string> = {
  transactions: 'Historial',
  deposits:     'Depósitos',
  withdrawals:  'Retiros',
  yields:       'Rendimientos',
};

function buildFilename(format: 'xlsx' | 'csv', dateFrom?: string, dateTo?: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const range = dateFrom && dateTo ? `_${dateFrom}_a_${dateTo}` : `_hasta_${today}`;
  return `nexu_operaciones${range}.${format}`;
}

export function downloadExcel(data: ExportData, dateFrom?: string, dateTo?: string): void {
  const workbook = XLSX.utils.book_new();

  const order: (keyof ExportData)[] = ['transactions', 'deposits', 'withdrawals', 'yields'];

  for (const key of order) {
    const rows = data[key];
    if (!rows || rows.length === 0) continue;
    const ws = XLSX.utils.json_to_sheet(rows as ExportRow[]);
    styleHeaderRow(ws, rows[0]);
    XLSX.utils.book_append_sheet(workbook, ws, SHEET_LABELS[key]);
  }

  if (workbook.SheetNames.length === 0) {
    // Create empty sheet to avoid empty workbook
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Sin datos']]), 'NEXU');
  }

  XLSX.writeFile(workbook, buildFilename('xlsx', dateFrom, dateTo));
}

export function downloadCSV(data: ExportData, dateFrom?: string, dateTo?: string): void {
  const order: (keyof ExportData)[] = ['transactions', 'deposits', 'withdrawals', 'yields'];
  const allRows: ExportRow[] = [];

  for (const key of order) {
    const rows = data[key];
    if (!rows || rows.length === 0) continue;
    const sectionLabel = SHEET_LABELS[key];
    rows.forEach((row) => allRows.push({ Sección: sectionLabel, ...row }));
  }

  if (allRows.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(allRows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const bom = '﻿'; // UTF-8 BOM so Excel opens with correct encoding
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = buildFilename('csv', dateFrom, dateTo);
  a.click();
  URL.revokeObjectURL(url);
}

function styleHeaderRow(ws: XLSX.WorkSheet, firstRow: ExportRow): void {
  const headers = Object.keys(firstRow);
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1');
  ws['!cols'] = headers.map(() => ({ wch: 22 }));
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[addr]) continue;
    ws[addr].s = { font: { bold: true } };
  }
}

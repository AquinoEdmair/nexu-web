import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading = false, 
  emptyMessage = 'No results found',
  className 
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto border rounded-md bg-white", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-slate-50">
          <tr className="border-b transition-colors hover:bg-slate-100/50">
            {columns.map((col, index) => (
              <th key={index} className="h-12 px-4 text-left align-middle font-medium text-slate-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                <div className="flex justify-center py-6">
                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-slate-500 h-24">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors hover:bg-slate-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle">
                    {col.cell ? col.cell(row) : (row as Record<string, unknown>)[col.accessorKey as string] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

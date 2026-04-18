export function formatCurrency(value: string | number, minDecimals: number = 2, maxDecimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Splits a formatted currency string into integer and decimal parts.
 * Useful for styling them differently.
 */
export function splitFormatCurrency(value: string | number, minDecimals: number = 2, maxDecimals: number = 2): { integer: string; decimal: string } {
  const formatted = formatCurrency(value, minDecimals, maxDecimals);
  const parts = formatted.split('.');
  return {
    integer: parts[0],
    decimal: parts[1] || '00',
  };
}

/**
 * Formats an ISO date string to a readable format (e.g. "24 MAY").
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short' }).toUpperCase();
}

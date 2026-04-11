/**
 * Formats a numeric string as currency display (e.g. "1,234.56").
 * Used across dashboard components for consistent formatting.
 */
export function formatCurrency(value: string, decimals: number = 2): string {
  return parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats an ISO date string to a readable format (e.g. "24 MAY").
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short' }).toUpperCase();
}

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

'use client';

import React from 'react';
import { splitFormatCurrency } from '@/lib/utils/format';

interface FormattedAmountProps {
  value: string | number;
  currency?: string;
  className?: string; // For the container
  integerClassName?: string; // For the integer part
  decimalClassName?: string; // For the decimal part
  symbol?: string;
  showSymbol?: boolean;
}

export function FormattedAmount({
  value,
  className = "flex items-baseline gap-0.5",
  integerClassName = "text-5xl md:text-6xl font-black text-white tracking-tighter",
  decimalClassName = "text-2xl md:text-3xl font-black text-white/50 tracking-tighter",
  symbol = "$",
  showSymbol = true,
}: FormattedAmountProps) {
  const { integer, decimal } = splitFormatCurrency(value);

  return (
    <div className={className}>
      {showSymbol && <span className={integerClassName}>{symbol}</span>}
      <span className={integerClassName}>{integer}</span>
      <span className={decimalClassName}>.</span>
      <span className={decimalClassName}>{decimal}</span>
    </div>
  );
}

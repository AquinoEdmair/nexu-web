import { z } from 'zod';

export const SUPPORTED_CURRENCIES = ['USDT', 'BTC', 'ETH'] as const;

export const depositSchema = z.object({
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export type DepositFormData = z.infer<typeof depositSchema>;

import { z } from 'zod';

export const WITHDRAWAL_CURRENCIES = ['USDT', 'BTC', 'ETH'] as const;

export const withdrawalSchema = z.object({
  amount: z
    .number({ error: 'Ingresa un monto válido' })
    .positive('El monto debe ser positivo')
    .max(999_999_999, 'Monto excede el máximo'),
  currency: z.enum(WITHDRAWAL_CURRENCIES),
  destination_address: z
    .string()
    .min(20, 'Dirección demasiado corta')
    .max(255, 'Dirección demasiado larga'),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

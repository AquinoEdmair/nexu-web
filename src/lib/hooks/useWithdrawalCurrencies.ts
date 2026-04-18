import { useQuery } from '@tanstack/react-query';
import { withdrawalsApi } from '@/lib/api/withdrawals';
import type { WithdrawalCurrency } from '@/types/models';

export function useWithdrawalCurrencies() {
  return useQuery<WithdrawalCurrency[]>({
    queryKey: ['withdrawal-currencies'],
    queryFn: async () => {
      const res = await withdrawalsApi.getCurrencies();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

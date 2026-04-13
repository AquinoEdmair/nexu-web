import { useQuery } from '@tanstack/react-query';
import { cryptoApi } from '@/lib/api/crypto';
import { CryptoCurrency } from '@/types/models';

export function useCurrencies() {
  return useQuery<CryptoCurrency[]>({
    queryKey: ['crypto-currencies'],
    queryFn: async () => {
      const res = await cryptoApi.getCurrencies();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — currencies rarely change
  });
}

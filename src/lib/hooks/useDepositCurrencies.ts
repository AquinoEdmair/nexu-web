import { useQuery } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';

export const useDepositCurrencies = () => {
  return useQuery({
    queryKey: ['deposit-currencies'],
    queryFn: () => depositsApi.getCurrencies(),
    staleTime: 5 * 60_000,
  });
};

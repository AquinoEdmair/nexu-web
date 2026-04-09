import { useQuery } from '@tanstack/react-query';
import { balanceApi } from '../api/balance';
import { useAuthStore } from '../store/authStore';

export const useBalanceHistory = (days = 30) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['balance', 'history', days],
    queryFn: () => balanceApi.getBalanceHistory(days),
    staleTime: 5 * 60_000, // 5min
    enabled: isAuthenticated,
  });
};

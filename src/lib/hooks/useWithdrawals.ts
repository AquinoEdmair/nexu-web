import { useQuery } from '@tanstack/react-query';
import { withdrawalsApi } from '../api/withdrawals';
import { useAuthStore } from '../store/authStore';

export const useWithdrawals = (params?: { page?: number; status?: string }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['withdrawals', params],
    queryFn: () => withdrawalsApi.getWithdrawals(params),
    staleTime: 60_000,
    enabled: isAuthenticated,
  });
};

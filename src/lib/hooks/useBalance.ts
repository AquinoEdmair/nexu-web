import { useQuery } from '@tanstack/react-query';
import { balanceApi } from '../api/balance';
import { useAuthStore } from '../store/authStore';

export const useBalance = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['balance'],
    queryFn: () => balanceApi.getBalance(),
    staleTime: 15_000,
    refetchInterval: 8_000,
    enabled: isAuthenticated,
  });
};

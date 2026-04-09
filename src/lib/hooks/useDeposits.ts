import { useQuery } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';
import { useAuthStore } from '../store/authStore';

export const useDeposits = (page = 1, perPage = 20) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['deposits', page, perPage],
    queryFn: () => depositsApi.getDeposits({ page, per_page: perPage }),
    staleTime: 60_000,
    enabled: isAuthenticated,
  });
};

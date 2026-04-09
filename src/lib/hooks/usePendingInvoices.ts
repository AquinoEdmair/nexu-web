import { useQuery } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';
import { useAuthStore } from '../store/authStore';

export const usePendingInvoices = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['deposits', 'pending'],
    queryFn: () => depositsApi.getPendingInvoices(),
    staleTime: 8_000,
    refetchInterval: 8_000,
    enabled: isAuthenticated,
  });
};

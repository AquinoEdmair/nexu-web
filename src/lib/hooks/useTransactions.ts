import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { Transaction } from '@/types/models';
import { PaginatedResponse } from '@/types/api';
import { useAuthStore } from '../store/authStore';

interface FetchTransactionsParams {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

const fetchTransactions = async (params: FetchTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
  // Clean empty params to keep URL tidy
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '' && v !== 'all')
  );
  
  const { data } = await apiClient.get('/transactions', { params: cleanParams });
  return data;
};

export const useTransactions = (params: FetchTransactionsParams = { page: 1, per_page: 20 }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
    staleTime: 1000 * 30, // 30s for more real-time feel
    enabled: isAuthenticated,
  });
};

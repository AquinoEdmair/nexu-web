import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { Transaction } from '@/types/models';
import { PaginatedResponse } from '@/types/api';
import { useAuthStore } from '../store/authStore';

interface FetchTransactionsParams {
  page?: number;
  per_page?: number;
  type?: string;
}

const fetchTransactions = async (params: FetchTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
  const { data } = await apiClient.get('/transactions', { params });
  return data;
};

export const useTransactions = (params: FetchTransactionsParams = { page: 1, per_page: 15 }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
    staleTime: 1000 * 60, // 60s
    enabled: isAuthenticated,
  });
};

import { ApiResponse, PaginatedResponse } from '@/types/api';
import { WithdrawalCurrency, WithdrawalRequest } from '@/types/models';
import { apiClient } from './axios';

export const withdrawalsApi = {
  createWithdrawal: async (data: {
    amount: number;
    currency: string;
    destination_address: string;
  }): Promise<ApiResponse<WithdrawalRequest>> => {
    const { data: response } = await apiClient.post('/withdrawals', data);
    return response;
  },

  getWithdrawals: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }): Promise<PaginatedResponse<WithdrawalRequest>> => {
    const { data } = await apiClient.get('/withdrawals', { params });
    return data;
  },

  cancelWithdrawal: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/withdrawals/${id}`);
    return data;
  },

  getCurrencies: async (): Promise<ApiResponse<WithdrawalCurrency[]>> => {
    const { data } = await apiClient.get('/withdrawals/currencies');
    return data;
  },
};

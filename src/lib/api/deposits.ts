import { ApiResponse, PaginatedResponse } from '@/types/api';
import { DepositCurrency, DepositRequest } from '@/types/models';
import { apiClient } from './axios';

export interface DepositCurrenciesResponse {
  data: DepositCurrency[];
  minimum_deposit_amount: number;
}

export const depositsApi = {
  getCurrencies: async (): Promise<DepositCurrenciesResponse> => {
    const { data } = await apiClient.get('/deposits/currencies');
    return data;
  },

  createDeposit: async (payload: { currency: string; amount: number }): Promise<ApiResponse<DepositRequest>> => {
    const { data } = await apiClient.post('/deposits', payload);
    return data;
  },

  getDeposits: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<DepositRequest>> => {
    const { data } = await apiClient.get('/deposits', { params });
    return data;
  },

  getDeposit: async (id: string): Promise<ApiResponse<DepositRequest>> => {
    const { data } = await apiClient.get(`/deposits/${id}`);
    return data;
  },

  confirmPayment: async (id: string, tx_hash: string): Promise<ApiResponse<DepositRequest>> => {
    const { data } = await apiClient.post(`/deposits/${id}/confirm`, { tx_hash });
    return data;
  },
};

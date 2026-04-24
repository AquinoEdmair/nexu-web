import { ApiResponse, PaginatedResponse } from '@/types/api';
import { WithdrawalCurrency, WithdrawalRequest } from '@/types/models';
import { apiClient } from './axios';

export const withdrawalsApi = {
  createWithdrawal: async (data: {
    amount: number;
    currency: string;
    destination_address: string;
    qr_image?: File | null;
  }): Promise<ApiResponse<WithdrawalRequest>> => {
    if (data.qr_image) {
      const form = new FormData();
      form.append('amount', String(data.amount));
      form.append('currency', data.currency);
      form.append('destination_address', data.destination_address);
      form.append('qr_image', data.qr_image);
      const { data: response } = await apiClient.post('/withdrawals', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    }
    const { data: response } = await apiClient.post('/withdrawals', {
      amount: data.amount,
      currency: data.currency,
      destination_address: data.destination_address,
    });
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

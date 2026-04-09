import { ApiResponse, PaginatedResponse } from '@/types/api';
import { DepositInvoice, Transaction } from '@/types/models';
import { apiClient } from './axios';

export const depositsApi = {
  initiateDeposit: async (currency: string, amount: number): Promise<ApiResponse<DepositInvoice>> => {
    const { data } = await apiClient.post('/deposits/initiate', { currency, amount });
    return data;
  },

  getDeposits: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get('/deposits', { params });
    return data;
  },

  getPendingInvoices: async (): Promise<ApiResponse<DepositInvoice[]>> => {
    const { data } = await apiClient.get('/deposits/pending');
    return data;
  },
  getInvoiceHistory: async (): Promise<ApiResponse<DepositInvoice[]>> => {
    const { data } = await apiClient.get('/deposits/invoices');
    return data;
  },
};

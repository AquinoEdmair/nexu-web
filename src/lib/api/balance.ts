import { ApiResponse } from '@/types/api';
import { BalanceData, BalanceHistoryEntry } from '@/types/models';
import { apiClient } from './axios';

export const balanceApi = {
  getBalance: async (): Promise<ApiResponse<BalanceData>> => {
    const response = await apiClient.get('/balance');
    return response.data;
  },

  getBalanceHistory: async (days = 30): Promise<ApiResponse<BalanceHistoryEntry[]>> => {
    const response = await apiClient.get('/balance/history', { params: { days } });
    return response.data;
  },
};

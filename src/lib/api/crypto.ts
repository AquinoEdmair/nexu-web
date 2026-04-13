import { ApiResponse } from '@/types/api';
import { CryptoCurrency } from '@/types/models';
import { apiClient } from './axios';

export const cryptoApi = {
  getCurrencies: async (): Promise<ApiResponse<CryptoCurrency[]>> => {
    const { data } = await apiClient.get('/crypto/currencies');
    return data;
  },
};

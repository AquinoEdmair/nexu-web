import { apiClient } from './axios';

export interface InvestmentResponse {
  transaction: {
    id: string;
    type: string;
    amount: string;
    net_amount: string;
    currency: string;
    status: string;
    created_at: string;
  };
  wallet: {
    balance_available: string;
    balance_in_operation: string;
    balance_total: string;
  };
}

export const investmentsApi = {
  invest: async (amount: number): Promise<{ data: InvestmentResponse; message: string }> => {
    const response = await apiClient.post('/investments', { amount });
    return response.data;
  },
};

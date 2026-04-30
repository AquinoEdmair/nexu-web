import { apiClient } from './axios';

export interface PublicConfig {
  telegram_community_url: string | null;
  minimum_deposit_amount: number;
}

export const configApi = {
  getPublicConfig: async () => {
    const { data } = await apiClient.get<PublicConfig>('/config');
    return data;
  },
};

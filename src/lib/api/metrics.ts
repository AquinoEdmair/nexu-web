import { apiClient } from './axios';
import { GlobalInvestmentResponse, UserRankingResponse, GoldPriceResponse, GoldNewsItem } from '@/types/metrics';

export const metricsApi = {
  getGlobalInvestment: async () => {
    const { data } = await apiClient.get<GlobalInvestmentResponse>('/metrics/global');
    return data;
  },

  getUserRanking: async () => {
    const { data } = await apiClient.get<UserRankingResponse>('/metrics/ranking');
    return data;
  },

  getGoldPrice: async () => {
    const { data } = await apiClient.get<GoldPriceResponse>('/metrics/gold');
    return data;
  },

  getGoldNews: async () => {
    const { data } = await apiClient.get<{ data: GoldNewsItem[] }>('/metrics/news');
    return data.data;
  },
};

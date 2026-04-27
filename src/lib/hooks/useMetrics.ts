import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '../api/metrics';

export const useGlobalInvestment = () => {
  return useQuery({
    queryKey: ['metrics', 'global-investment'],
    queryFn: metricsApi.getGlobalInvestment,
    staleTime: Infinity, // Carga única al montar
  });
};

export const useUserRanking = () => {
  return useQuery({
    queryKey: ['metrics', 'user-ranking'],
    queryFn: metricsApi.getUserRanking,
    staleTime: Infinity, // Carga única al montar
  });
};

export const useGoldPrice = (range: string = '1w') => {
  return useQuery({
    queryKey: ['metrics', 'gold-price', range],
    queryFn: () => metricsApi.getGoldPrice(range),
    staleTime: 10_000,          // 10s
    refetchInterval: 10_000,    // auto-refetch every 10s
    refetchIntervalInBackground: false,
  });
};

export const useGoldNews = () => {
  return useQuery({
    queryKey: ['metrics', 'gold-news'],
    queryFn: metricsApi.getGoldNews,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['metrics', 'recent-activity'],
    queryFn: metricsApi.getRecentActivity,
    staleTime: 30_000,          // 30s
    refetchInterval: 30_000,    // auto-refetch every 30s
  });
};

import { useQuery } from '@tanstack/react-query';
import { getYieldHistory } from '@/lib/api/yields';

export const yieldKeys = {
  all: ['yields'] as const,
  history: (page: number, perPage: number, days: number) => [...yieldKeys.all, 'history', { page, perPage, days }] as const,
};

export function useYields(page = 1, perPage = 20, days = 0) {
  return useQuery({
    queryKey: yieldKeys.history(page, perPage, days),
    queryFn: () => getYieldHistory(page, perPage, days),
    staleTime: 10_000,
    refetchInterval: 15_000,
    placeholderData: (previousData) => previousData,
  });
}

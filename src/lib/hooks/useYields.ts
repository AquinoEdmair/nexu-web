import { useQuery } from '@tanstack/react-query';
import { getYieldHistory } from '@/lib/api/yields';

export const yieldKeys = {
  all: ['yields'] as const,
  history: (page: number, perPage: number, days: number, hours: number) => [...yieldKeys.all, 'history', { page, perPage, days, hours }] as const,
};

export function useYields(page = 1, perPage = 20, days = 0, hours = 0) {
  return useQuery({
    queryKey: yieldKeys.history(page, perPage, days, hours),
    queryFn: () => getYieldHistory(page, perPage, days, hours),
    staleTime: 10_000,
    refetchInterval: 15_000,
    placeholderData: (previousData) => previousData,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments';

export const useInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => investmentsApi.invest(amount),
    onSuccess: () => {
      // Invalidate balance and yields cache so UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['yields'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

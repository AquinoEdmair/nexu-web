import { useMutation, useQueryClient } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';

export const useInitiateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currency, amount }: { currency: string; amount: number }) => depositsApi.initiateDeposit(currency, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits', 'pending'] });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawalsApi } from '../api/withdrawals';

export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawalsApi.cancelWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};

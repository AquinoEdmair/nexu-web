import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawalsApi } from '../api/withdrawals';

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawalsApi.createWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
};

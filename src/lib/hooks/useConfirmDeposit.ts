import { useMutation, useQueryClient } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';

export const useConfirmDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tx_hash }: { id: string; tx_hash: string }) =>
      depositsApi.confirmPayment(id, tx_hash),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
    },
  });
};

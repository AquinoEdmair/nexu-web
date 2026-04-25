import { useMutation, useQueryClient } from '@tanstack/react-query';
import { depositsApi } from '../api/deposits';

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: depositsApi.createDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
    },
  });
};

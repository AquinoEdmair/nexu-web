import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/team';

export const useTeam = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: teamApi.getMembers,
    staleTime: 5 * 60 * 1000,
  });
};

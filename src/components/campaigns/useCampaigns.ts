import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/client';

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  type: 'informative' | 'action';
  cta_text: string | null;
  cta_url: string | null;
  cta_type: 'redirect' | 'api_action' | 'none';
  priority: number;
}

export function useCampaigns() {
  const queryClient = useQueryClient();

  const { data: activeCampaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', 'active'],
    queryFn: async (): Promise<Campaign[]> => {
      const response = await api.get('/api/v1/campaigns/active');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const markAsViewed = useMutation({
    mutationFn: async (campaignId: string) => {
      await api.post(`/api/v1/campaigns/${campaignId}/view`);
    },
  });

  const respondToCampaign = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accepted' | 'rejected' }) => {
      await api.post(`/api/v1/campaigns/${id}/action`, { action });
    },
    onSuccess: () => {
      // Refresh the list so accepted/rejected campaigns disappear
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'active'] });
    },
  });

  return {
    activeCampaigns,
    isLoading,
    markAsViewed,
    respondToCampaign,
  };
}

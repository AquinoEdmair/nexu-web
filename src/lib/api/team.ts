import { apiClient } from './axios';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photo_url: string | null;
}

export const teamApi = {
  getMembers: async (): Promise<TeamMember[]> => {
    const { data } = await apiClient.get<{ data: TeamMember[] }>('/team');
    return data.data;
  },
};

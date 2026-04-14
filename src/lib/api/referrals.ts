import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  ElitePointEntry,
  ReferralCodeValidation,
  ReferralEarning,
  ReferralNode,
  ReferralSummary,
} from '@/types/models';
import { apiClient } from './axios';

export const referralsApi = {
  getSummary: async (): Promise<ApiResponse<ReferralSummary>> => {
    const response = await apiClient.get('/referrals/summary');
    return response.data;
  },

  getNetwork: async (
    page = 1,
    perPage = 15,
  ): Promise<PaginatedResponse<ReferralNode>> => {
    const response = await apiClient.get('/referrals/network', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  getEarnings: async (
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<ReferralEarning>> => {
    const response = await apiClient.get('/referrals/earnings', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  getPointsHistory: async (
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<ElitePointEntry>> => {
    const response = await apiClient.get('/referrals/points-history', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  validateCode: async (code: string): Promise<ApiResponse<ReferralCodeValidation>> => {
    const response = await apiClient.post('/auth/validate-referral-code', { code });
    return response.data;
  },
};

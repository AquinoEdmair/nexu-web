import { ApiResponse } from '@/types/api';
import { User } from '@/types/models';
import { apiClient } from './axios';
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '../validators/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async (): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};

import { apiClient } from './axios';
import type { YieldLogEntry } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';

export async function getYieldHistory(page = 1, perPage = 20, days = 0, hours = 0): Promise<PaginatedResponse<YieldLogEntry>> {
  const { data } = await apiClient.get<PaginatedResponse<YieldLogEntry>>('/yields', {
    params: { page, per_page: perPage, ...(days > 0 ? { days } : {}), ...(hours > 0 ? { hours } : {}) },
  });
  return data;
}

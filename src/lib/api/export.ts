import { apiClient } from './axios';

export interface ExportRow {
  [key: string]: string | number;
}

export interface ExportData {
  transactions?: ExportRow[];
  deposits?:     ExportRow[];
  withdrawals?:  ExportRow[];
  yields?:       ExportRow[];
}

export interface ExportParams {
  sections: string;
  date_from?: string;
  date_to?: string;
}

export const exportApi = {
  fetch: async (params: ExportParams): Promise<ExportData> => {
    const { data } = await apiClient.get('/export', { params });
    return data.data as ExportData;
  },
};

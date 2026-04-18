import { apiClient } from './axios';
import type { SupportTicket } from '@/types/models';

export interface PaginatedTickets {
  data: SupportTicket[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const getTickets = (page = 1): Promise<PaginatedTickets> =>
  apiClient.get('/support/tickets', { params: { page } }).then(r => r.data);

export const getTicket = (id: string): Promise<{ data: SupportTicket }> =>
  apiClient.get(`/support/tickets/${id}`).then(r => r.data);

export const createTicket = (payload: { subject: string; message: string }): Promise<{ data: SupportTicket }> =>
  apiClient.post('/support/tickets', payload).then(r => r.data);

export const replyTicket = (id: string, message: string): Promise<{ data: SupportTicket }> =>
  apiClient.post(`/support/tickets/${id}/messages`, { message }).then(r => r.data);

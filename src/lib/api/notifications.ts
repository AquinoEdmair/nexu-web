import { apiClient } from './axios';

export interface InAppNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: string | number;
  data: {
    type: string;
    title: string;
    body: string;
    url: string;
    meta?: Record<string, unknown>;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsPage {
  data: InAppNotification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export async function getNotifications(page = 1): Promise<NotificationsPage> {
  const res = await apiClient.get(`/notifications?page=${page}`);
  return res.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiClient.get('/notifications/unread-count');
  return res.data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post('/notifications/read-all');
}

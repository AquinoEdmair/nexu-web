import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTicket, getTicket, getTickets, replyTicket } from '@/lib/api/support';

export const useTickets = (page = 1) =>
  useQuery({
    queryKey: ['support-tickets', page],
    queryFn: () => getTickets(page),
  });

export const useTicket = (id: string) =>
  useQuery({
    queryKey: ['support-ticket', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support-tickets'] }),
  });
};

export const useReplyTicket = (ticketId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => replyTicket(ticketId, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-ticket', ticketId] });
      qc.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
};

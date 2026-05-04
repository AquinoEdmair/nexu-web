'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import { useAuthStore } from '@/lib/store/authStore';
import type { Transaction } from '@/types/models';

export interface ActivationSummary {
  // Total en activación (suma de net_amount donde available_at > now)
  deposit: { total: string; nextAvailableAt: string | null; daysLeft: number | null; count: number };
  yield: { total: string; nextAvailableAt: string | null; daysLeft: number | null; count: number };
  commission: { total: string; nextAvailableAt: string | null; daysLeft: number | null; count: number };
  // Listado plano de transacciones aún en activación
  items: ActivatingTransaction[];
}

export interface ActivatingTransaction {
  id: string;
  type: 'deposit' | 'yield' | 'referral_commission' | 'commission';
  net_amount: string;
  available_at: string;
  created_at: string;
  daysLeft: number;
}

function calcDaysLeft(available_at: string): number {
  const diff = new Date(available_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

async function fetchActivatingTransactions(): Promise<ActivationSummary> {
  // Fetch confirmed transactions of the relevant types — they all have available_at set
  const res = await apiClient.get<{ data: Transaction[]; meta: { last_page: number } }>('/transactions', {
    params: {
      type: ['deposit', 'yield', 'referral_commission', 'commission'],
      status: 'confirmed',
      per_page: 50,
    },
    paramsSerializer: (params) => {
      const parts: string[] = [];
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          value.forEach((v) => parts.push(`${key}[]=${encodeURIComponent(v)}`));
        } else {
          parts.push(`${key}=${encodeURIComponent(value as string)}`);
        }
      }
      return parts.join('&');
    },
  });

  const now = new Date();
  const allTx = res.data.data;

  // Filter only those still activating (available_at in the future)
  const activating = allTx.filter((tx) => tx.available_at && new Date(tx.available_at) > now);

  const summaryFor = (types: string[]) => {
    const subset = activating.filter((tx) => types.includes(tx.type));
    const total = subset.reduce((acc, tx) => acc + parseFloat(tx.net_amount || '0'), 0);
    const sorted = [...subset].sort((a, b) => new Date(a.available_at!).getTime() - new Date(b.available_at!).getTime());
    const next = sorted[0];
    return {
      total: total.toFixed(2),
      nextAvailableAt: next?.available_at ?? null,
      daysLeft: next ? calcDaysLeft(next.available_at!) : null,
      count: subset.length,
    };
  };

  const items: ActivatingTransaction[] = activating
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
    .map((tx) => ({
      id: tx.id,
      type: tx.type as ActivatingTransaction['type'],
      net_amount: tx.net_amount,
      available_at: tx.available_at!,
      created_at: tx.created_at,
      daysLeft: calcDaysLeft(tx.available_at!),
    }));

  return {
    deposit: summaryFor(['deposit']),
    yield: summaryFor(['yield']),
    commission: summaryFor(['referral_commission', 'commission']),
    items,
  };
}

export function useActivatingTransactions() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['activating-transactions'],
    queryFn: fetchActivatingTransactions,
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: isAuthenticated,
  });
}

import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '../api/referrals';
import { useAuthStore } from '../store/authStore';

export const referralKeys = {
  all:           ['referrals'] as const,
  summary:       () => [...referralKeys.all, 'summary'] as const,
  network:       (page: number) => [...referralKeys.all, 'network', page] as const,
  earnings:      (page: number) => [...referralKeys.all, 'earnings', page] as const,
  pointsHistory: (page: number) => [...referralKeys.all, 'points-history', page] as const,
  validate:      (code: string) => [...referralKeys.all, 'validate', code] as const,
};

export const useReferralSummary = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: referralKeys.summary(),
    queryFn:  () => referralsApi.getSummary(),
    staleTime: 5 * 60_000, // 5 min
    enabled:  isAuthenticated,
  });
};

export const useReferralNetwork = (page = 1) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: referralKeys.network(page),
    queryFn:  () => referralsApi.getNetwork(page),
    staleTime: 5 * 60_000,
    enabled:  isAuthenticated,
  });
};

export const useReferralEarnings = (page = 1) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: referralKeys.earnings(page),
    queryFn:  () => referralsApi.getEarnings(page),
    staleTime: 5 * 60_000,
    enabled:  isAuthenticated,
  });
};

export const useElitePointsHistory = (page = 1) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: referralKeys.pointsHistory(page),
    queryFn:  () => referralsApi.getPointsHistory(page),
    staleTime: 5 * 60_000,
    enabled:  isAuthenticated,
  });
};

/**
 * Validates a referral code before registration.
 * Only fires when code is non-empty (no wasted requests on empty input).
 */
export const useValidateReferralCode = (code: string) => {
  return useQuery({
    queryKey: referralKeys.validate(code),
    queryFn:  () => referralsApi.validateCode(code),
    staleTime: Infinity, // code validity doesn't change within a session
    enabled:  code.trim().length >= 4,
    retry: false,
  });
};

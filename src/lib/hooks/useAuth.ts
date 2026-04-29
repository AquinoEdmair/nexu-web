import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '../validators/auth';
import { useAuthStore } from '../store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/types/api';
import { AxiosError } from 'axios';

function extractErrorMessage(error: unknown): string {
  const axiosErr = error as AxiosError<ApiError>;
  return axiosErr.response?.data?.message ?? 'validation.unexpectedError';
}

function extractFieldErrors(error: unknown): Record<string, string[]> | undefined {
  const axiosErr = error as AxiosError<ApiError>;
  return axiosErr.response?.data?.errors;
}

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      const redirect = searchParams.get('redirect') ?? '/dashboard';
      router.push(redirect);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? extractErrorMessage(mutation.error) : null,
    fieldErrors: mutation.error ? extractFieldErrors(mutation.error) : undefined,
    reset: mutation.reset,
  };
};

export const useRegister = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (_data, variables) => {
      // Do not auto-login: user must verify email first.
      const email = encodeURIComponent(variables.email);
      router.push(`/verify-email-sent?email=${email}`);
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? extractErrorMessage(mutation.error) : null,
    fieldErrors: mutation.error ? extractFieldErrors(mutation.error) : undefined,
    reset: mutation.reset,
  };
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
  };
};

export const useMe = () => {
  const { isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10min — profile data rarely changes
  });

  return {
    user: query.data?.data.user ?? null,
    isLoading: query.isLoading,
  };
};

export const useRefreshToken = () => {
  const { setAuth, logout, setLoading } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
    },
    onError: () => {
      logout();
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return {
    refresh: mutation.mutate,
    isLoading: mutation.isPending,
  };
};

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
  });

  return {
    sendResetLink: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? extractErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
};

export const useResetPassword = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      router.push('/login');
    },
  });

  return {
    resetPassword: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? extractErrorMessage(mutation.error) : null,
    fieldErrors: mutation.error ? extractFieldErrors(mutation.error) : undefined,
    reset: mutation.reset,
  };
};

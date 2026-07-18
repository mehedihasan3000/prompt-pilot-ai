'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authApi from '@/services/api/auth';
import { setAuthToken, clearAuthToken } from '@/lib/api';
import type { User, AuthResponse } from '@/types/user.types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const result = await authApi.getMe();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to get user');
      }
      return result.data as User;
    },
    retry: false,
    staleTime: 60000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const token = result.data.token;
        if (token) setAuthToken(token);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        router.push('/dashboard');
      }
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ name, email, password, confirmPassword }: { name: string; email: string; password: string; confirmPassword: string }) =>
      authApi.register(name, email, password, confirmPassword),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const token = result.data.token;
        if (token) setAuthToken(token);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        router.push('/dashboard');
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
      router.push('/');
    },
  });
}

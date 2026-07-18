import { apiFetch } from '@/lib/api';
import type { User, AuthResponse } from '@/types/user.types';

export async function register(name: string, email: string, password: string, confirmPassword: string) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin() {
  return apiFetch<{ url: string }>('/auth/google');
}

export async function demoLogin() {
  return apiFetch<AuthResponse>('/auth/demo-login', {
    method: 'POST',
  });
}

export async function logout() {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getMe() {
  return apiFetch<User>('/auth/me');
}

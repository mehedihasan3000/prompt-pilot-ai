import { apiFetch } from '@/lib/api';
import type { User, Session } from '@/types/user.types';

export async function register(name: string, email: string, password: string) {
  return apiFetch<Session>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<Session>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin() {
  return apiFetch<{ url: string }>('/auth/google');
}

export async function demoLogin() {
  return apiFetch<Session>('/auth/demo', {
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

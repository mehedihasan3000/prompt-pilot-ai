import { apiFetch } from '@/lib/api';
import type { Prompt, CreatePromptPayload, UpdatePromptPayload } from '@/types/prompt.types';

export function getPrompts(params?: {
  search?: string;
  category?: string;
  targetModel?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });
  }
  const query = searchParams.toString();
  return apiFetch<{ prompts: Prompt[]; total: number; page: number; limit: number; totalPages: number }>(
    `/prompts${query ? `?${query}` : ''}`
  );
}

export function getPrompt(id: string) {
  return apiFetch<Prompt>(`/prompts/${id}`);
}

export function createPrompt(payload: CreatePromptPayload) {
  return apiFetch<Prompt>('/prompts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePrompt(id: string, payload: UpdatePromptPayload) {
  return apiFetch<Prompt>(`/prompts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deletePrompt(id: string) {
  return apiFetch<void>(`/prompts/${id}`, {
    method: 'DELETE',
  });
}

export function toggleFavorite(id: string) {
  return apiFetch<Prompt>(`/prompts/${id}/favorite`, {
    method: 'PATCH',
  });
}

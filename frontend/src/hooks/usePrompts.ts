'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as promptsApi from '@/services/api/prompts';
import type { Prompt, CreatePromptPayload, UpdatePromptPayload } from '@/types/prompt.types';

interface PromptsFilters {
  search?: string;
  category?: string;
  targetModel?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export function usePrompts(filters?: PromptsFilters) {
  return useQuery({
    queryKey: ['prompts', filters],
    queryFn: async () => {
      const result = await promptsApi.getPrompts(filters);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch prompts');
      }
      return result.data;
    },
  });
}

export function usePrompt(id: string) {
  const isValid = !!id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  return useQuery({
    queryKey: ['prompts', id],
    queryFn: async () => {
      const result = await promptsApi.getPrompt(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch prompt');
      }
      return result.data as Prompt;
    },
    enabled: isValid,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromptPayload) => promptsApi.createPrompt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePromptPayload }) =>
      promptsApi.updatePrompt(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts', variables.id] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promptsApi.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      promptsApi.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}

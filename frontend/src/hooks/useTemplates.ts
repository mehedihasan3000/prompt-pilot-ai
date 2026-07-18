'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as templatesApi from '@/services/api/templates';
import type { Template, CreateTemplatePayload, UpdateTemplatePayload } from '@/types/template.types';

interface TemplatesFilters {
  search?: string;
  category?: string;
  targetModel?: string;
  difficulty?: string;
  userId?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export function useTemplates(filters?: TemplatesFilters) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: async () => {
      const result = await templatesApi.getTemplates(filters);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch templates');
      }
      return result.data;
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['templates', id],
    queryFn: async () => {
      const result = await templatesApi.getTemplate(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch template');
      }
      return result.data as Template;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => templatesApi.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTemplatePayload }) =>
      templatesApi.updateTemplate(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['templates', variables.id] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

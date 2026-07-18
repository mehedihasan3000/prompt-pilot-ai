import { apiFetch } from '@/lib/api';
import type { Template, CreateTemplatePayload, UpdateTemplatePayload } from '@/types/template.types';

export function getTemplates(params?: {
  search?: string;
  category?: string;
  targetModel?: string;
  difficulty?: string;
  userId?: string;
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
  return apiFetch<{ templates: Template[]; total: number; page: number; limit: number; totalPages: number }>(
    `/templates${query ? `?${query}` : ''}`
  );
}

export function getTemplate(id: string) {
  return apiFetch<Template>(`/templates/${id}`);
}

export function createTemplate(payload: CreateTemplatePayload) {
  return apiFetch<Template>('/templates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTemplate(id: string, payload: UpdateTemplatePayload) {
  return apiFetch<Template>(`/templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTemplate(id: string) {
  return apiFetch<void>(`/templates/${id}`, {
    method: 'DELETE',
  });
}

export function incrementTemplateUsage(id: string) {
  return apiFetch<Template>(`/templates/${id}/use`, {
    method: 'POST',
  });
}

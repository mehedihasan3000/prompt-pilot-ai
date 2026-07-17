import { apiFetch } from '@/lib/api';
import type { AnalyticsSummary, PromptsOverTimeData, CategoryUsageData, ModelUsageData, ScoreTrendData } from '@/types/analytics.types';

export function getSummary(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<AnalyticsSummary>(`/analytics/summary${query}`);
}

export function getPromptsOverTime(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<PromptsOverTimeData>(`/analytics/prompts-over-time${query}`);
}

export function getCategoryUsage(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<CategoryUsageData[]>(`/analytics/category-usage${query}`);
}

export function getModelUsage(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<ModelUsageData[]>(`/analytics/model-usage${query}`);
}

export function getScoreTrends(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<ScoreTrendData[]>(`/analytics/score-trends${query}`);
}

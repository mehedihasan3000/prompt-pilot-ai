import { apiFetch } from '@/lib/api';
import type { AnalyticsSummary, PromptsOverTimeData, CategoryUsageData, ModelUsageData, ScoreTrendData, RecentActivityItem } from '@/types/analytics.types';

export function getSummary() {
  return apiFetch<AnalyticsSummary>('/analytics/summary');
}

export function getPromptsOverTime() {
  return apiFetch<PromptsOverTimeData[]>('/analytics/prompts-over-time');
}

export function getCategoryUsage() {
  return apiFetch<CategoryUsageData[]>('/analytics/category-usage');
}

export function getModelUsage() {
  return apiFetch<ModelUsageData[]>('/analytics/model-usage');
}

export function getScoreTrends() {
  return apiFetch<ScoreTrendData[]>('/analytics/score-trends');
}

export function getRecentActivity() {
  return apiFetch<RecentActivityItem[]>('/analytics/recent-activity');
}

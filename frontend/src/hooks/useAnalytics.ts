'use client';

import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/services/api/analytics';
import type { AnalyticsSummary, PromptsOverTimeData, CategoryUsageData, ModelUsageData, ScoreTrendData, RecentActivityItem } from '@/types/analytics.types';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const result = await analyticsApi.getSummary();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch analytics summary');
      return result.data as AnalyticsSummary;
    },
  });
}

export function usePromptsOverTime() {
  return useQuery({
    queryKey: ['analytics', 'prompts-over-time'],
    queryFn: async () => {
      const result = await analyticsApi.getPromptsOverTime();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch prompts over time');
      return result.data as PromptsOverTimeData[];
    },
  });
}

export function useCategoryUsage() {
  return useQuery({
    queryKey: ['analytics', 'category-usage'],
    queryFn: async () => {
      const result = await analyticsApi.getCategoryUsage();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch category usage');
      return result.data as CategoryUsageData[];
    },
  });
}

export function useModelUsage() {
  return useQuery({
    queryKey: ['analytics', 'model-usage'],
    queryFn: async () => {
      const result = await analyticsApi.getModelUsage();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch model usage');
      return result.data as ModelUsageData[];
    },
  });
}

export function useScoreTrends() {
  return useQuery({
    queryKey: ['analytics', 'score-trends'],
    queryFn: async () => {
      const result = await analyticsApi.getScoreTrends();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch score trends');
      return result.data as ScoreTrendData[];
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['analytics', 'recent-activity'],
    queryFn: async () => {
      const result = await analyticsApi.getRecentActivity();
      if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch recent activity');
      return result.data as RecentActivityItem[];
    },
  });
}

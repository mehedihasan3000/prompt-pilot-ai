'use client';

import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '@/services/api/analytics';
import type { AnalyticsSummary, PromptsOverTimeData, CategoryUsageData, ModelUsageData, ScoreTrendData } from '@/types/analytics.types';

export function useAnalyticsSummary(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'summary', period],
    queryFn: async () => {
      const result = await analyticsApi.getSummary(period);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch analytics summary');
      }
      return result.data as AnalyticsSummary;
    },
  });
}

export function usePromptsOverTime(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'prompts-over-time', period],
    queryFn: async () => {
      const result = await analyticsApi.getPromptsOverTime(period);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch prompts over time');
      }
      return result.data as PromptsOverTimeData;
    },
  });
}

export function useCategoryUsage(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'category-usage', period],
    queryFn: async () => {
      const result = await analyticsApi.getCategoryUsage(period);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch category usage');
      }
      return result.data as CategoryUsageData[];
    },
  });
}

export function useModelUsage(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'model-usage', period],
    queryFn: async () => {
      const result = await analyticsApi.getModelUsage(period);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch model usage');
      }
      return result.data as ModelUsageData[];
    },
  });
}

export function useScoreTrends(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'score-trends', period],
    queryFn: async () => {
      const result = await analyticsApi.getScoreTrends(period);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch score trends');
      }
      return result.data as ScoreTrendData[];
    },
  });
}

import { apiFetch } from '@/lib/api';
import type { AnalysisResult, OptimizedResult, VariantResult, ScoreResult, Recommendation, ChatMessage, AutoTagResult } from '@/types/ai.types';

export function analyzePrompt(promptId: string) {
  return apiFetch<AnalysisResult>(`/ai/analyze/${promptId}`, {
    method: 'POST',
  });
}

export function optimizePrompt(promptId: string, goal?: string) {
  return apiFetch<OptimizedResult>(`/ai/optimize/${promptId}`, {
    method: 'POST',
    body: JSON.stringify({ goal }),
  });
}

export function generateVariants(promptId: string, count?: number) {
  return apiFetch<VariantResult>(`/ai/variants/${promptId}`, {
    method: 'POST',
    body: JSON.stringify({ count: count || 3 }),
  });
}

export function scorePrompt(promptId: string) {
  return apiFetch<ScoreResult>(`/ai/score/${promptId}`, {
    method: 'POST',
  });
}

export function getRecommendations(promptId: string) {
  return apiFetch<Recommendation[]>(`/ai/recommendations/${promptId}`);
}

export function sendChatMessage(conversationId: string | null, message: string) {
  return apiFetch<{ reply: ChatMessage; conversationId: string }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ conversationId, message }),
  });
}

export function autoTag(promptId: string) {
  return apiFetch<AutoTagResult>(`/ai/auto-tag/${promptId}`, {
    method: 'POST',
  });
}

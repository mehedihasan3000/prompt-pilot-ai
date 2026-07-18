import { apiFetch } from '@/lib/api';
import type { OrchestratorResult, OptimizeResult, VariantItem, ScoreResult, RecommendationItem, ChatResponse, AutoTagResult } from '@/types/ai.types';

export interface AnalyzeInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone: string;
  language: string;
  outputLength: string;
  outputFormat: string;
  audience?: string;
  category?: string;
  extraContext?: string;
  constraints?: string;
  examples?: string;
  creativityLevel?: number;
}

export function analyzePrompt(data: AnalyzeInput) {
  return apiFetch<OrchestratorResult>('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function optimizePrompt(data: Partial<AnalyzeInput>) {
  return apiFetch<OptimizeResult>('/ai/optimize', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function generateVariants(data: { originalPrompt: string; optimizedPrompt: string; goal: string; targetModel: string; tone: string }) {
  return apiFetch<{ variants: VariantItem[] }>('/ai/generate-variants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function scorePrompt(data: { originalPrompt: string; optimizedPrompt: string; goal: string; targetModel: string; tone: string }) {
  return apiFetch<ScoreResult>('/ai/score', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getRecommendations(data: { originalPrompt: string; optimizedPrompt: string; score: number; strengths: string[]; weaknesses: string[] }) {
  return apiFetch<{ recommendations: RecommendationItem[] }>('/ai/recommend', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function sendChatMessage(data: { message: string; conversationHistory?: { role: 'user' | 'assistant'; content: string }[]; conversationId?: string }) {
  return apiFetch<ChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function autoTag(data: { originalPrompt: string; goal: string; category?: string; outputFormat: string; targetModel: string }) {
  return apiFetch<AutoTagResult>('/ai/auto-tag', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

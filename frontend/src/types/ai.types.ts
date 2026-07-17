import type { ScoreBreakdown } from './prompt.types';

export interface AnalysisResult {
  id: string;
  promptId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  scoreBreakdown: ScoreBreakdown;
  createdAt: string;
}

export interface OptimizedResult {
  id: string;
  promptId: string;
  content: string;
  label: string;
  improvements: string[];
  score: number;
  scoreBreakdown: ScoreBreakdown;
  createdAt: string;
}

export interface VariantResult {
  variants: OptimizedResult[];
}

export interface ScoreResult {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  feedback: string;
}

export interface Recommendation {
  id: string;
  promptId: string;
  type: 'clarity' | 'specificity' | 'context' | 'structure' | 'constraints';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AutoTagResult {
  tags: string[];
  category: string;
}

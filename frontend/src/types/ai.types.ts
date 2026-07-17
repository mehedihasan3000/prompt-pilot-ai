export interface OrchestratorResult {
  plan: { intent: string; taskType: string };
  analysis: { score: number; strengths: string[]; weaknesses: string[]; missingContext: string[]; analysis: string };
  contextCheck: { missingContextPoints: string[]; requiredFollowUps: string[] };
  followUpQuestions: string[];
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
  variants: { type: string; content: string }[];
  scoreResult: { totalScore: number; clarity: number; context: number; specificity: number; constraints: number; outputFormat: number; toneAlignment: number; grade: string; explanation: string };
  recommendations: { title: string; description: string; priority: string }[];
  autoTags: { tags: string[]; category: string };
}

export interface OptimizeResult {
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
}

export interface VariantItem {
  type: string;
  content: string;
}

export interface ScoreResult {
  totalScore: number;
  clarity: number;
  context: number;
  specificity: number;
  constraints: number;
  outputFormat: number;
  toneAlignment: number;
  grade: string;
  explanation: string;
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatResponse {
  reply: string;
  suggestedFollowUps: string[];
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

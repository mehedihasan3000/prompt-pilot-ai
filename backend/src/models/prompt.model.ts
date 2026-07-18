import { ObjectId } from 'mongodb';

export interface Variant {
  type: string;
  content: string;
}

export interface ScoreBreakdown {
  clarity: number;
  context: number;
  specificity: number;
  constraints: number;
  outputFormat: number;
  toneAlignment: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

export interface Prompt {
  _id?: ObjectId;
  userId: string;
  title: string;
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone: string;
  language: string;
  outputLength: string;
  outputFormat: string;
  audience?: string;
  category: string;
  tags: string[];
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
  variants: Variant[];
  score: number;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  missingContext: string[];
  analysis: string;
  recommendations: Recommendation[];
  followUpQuestions: string[];
  contextCheck: { missingContextPoints: string[]; requiredFollowUps: string[] };
  autoTags: { tags: string[]; category: string };
  plan: { intent: string; taskType: string };
  favorite: boolean;
  collectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const promptCollection = 'prompts';

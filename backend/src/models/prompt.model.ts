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
  variants: Variant[];
  score: number;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  followUpQuestions: string[];
  favorite: boolean;
  collectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const promptCollection = 'prompts';

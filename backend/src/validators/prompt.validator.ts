import { z } from 'zod';

const variantSchema = z.object({
  type: z.string(),
  content: z.string(),
});

const recommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.string(),
});

export const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  originalPrompt: z.string().min(1),
  goal: z.string().min(1),
  targetModel: z.string().min(1),
  tone: z.string().min(1),
  language: z.string().min(1),
  outputLength: z.string().min(1),
  outputFormat: z.string().min(1),
  audience: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  collectionId: z.string().optional(),
  optimizedPrompt: z.string().optional().default(''),
  explanation: z.string().optional().default(''),
  changesMade: z.array(z.string()).optional().default([]),
  variants: z.array(variantSchema).optional().default([]),
  score: z.number().optional().default(0),
  scoreBreakdown: z.object({
    clarity: z.number(),
    context: z.number(),
    specificity: z.number(),
    constraints: z.number(),
    outputFormat: z.number(),
    toneAlignment: z.number(),
  }).optional(),
  strengths: z.array(z.string()).optional().default([]),
  weaknesses: z.array(z.string()).optional().default([]),
  missingContext: z.array(z.string()).optional().default([]),
  analysis: z.string().optional().default(''),
  recommendations: z.array(recommendationSchema).optional().default([]),
  followUpQuestions: z.array(z.string()).optional().default([]),
  contextCheck: z.object({
    missingContextPoints: z.array(z.string()),
    requiredFollowUps: z.array(z.string()),
  }).optional(),
  autoTags: z.object({
    tags: z.array(z.string()),
    category: z.string(),
  }).optional(),
  plan: z.object({
    intent: z.string(),
    taskType: z.string(),
  }).optional(),
});

export const updatePromptSchema = createPromptSchema.partial();

import { z } from 'zod';

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
});

export const updatePromptSchema = createPromptSchema.partial();

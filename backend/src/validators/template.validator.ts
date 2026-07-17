import { z } from 'zod';

export const createTemplateSchema = z.object({
  title: z.string().min(1).max(200),
  shortDescription: z.string().min(1).max(300),
  fullDescription: z.string().min(1),
  promptContent: z.string().min(1),
  category: z.string().min(1),
  targetModel: z.string().min(1),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  tone: z.string().optional(),
  outputType: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url().optional(),
  visibility: z.enum(['public', 'private']).optional().default('public'),
});

export const updateTemplateSchema = createTemplateSchema.partial();

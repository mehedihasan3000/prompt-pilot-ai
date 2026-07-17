import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

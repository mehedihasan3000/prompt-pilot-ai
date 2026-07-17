export interface Template {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  promptContent: string;
  category: string;
  targetModel: string;
  difficulty: string;
  tone?: string;
  outputType?: string;
  tags: string[];
  imageUrl?: string;
  visibility: 'public' | 'private';
  usageCount: number;
  averageRating: number;
  userId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplatePayload {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  promptContent: string;
  category: string;
  targetModel: string;
  difficulty: string;
  tone?: string;
  outputType?: string;
  tags?: string[];
  imageUrl?: string;
  visibility?: 'public' | 'private';
}

export interface UpdateTemplatePayload {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  promptContent?: string;
  category?: string;
  targetModel?: string;
  difficulty?: string;
  tone?: string;
  outputType?: string;
  tags?: string[];
  imageUrl?: string;
  visibility?: 'public' | 'private';
}

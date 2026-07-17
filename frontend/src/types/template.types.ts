export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  model?: string;
  tags: string[];
  usageCount: number;
  averageScore?: number;
  isPublic: boolean;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplatePayload {
  title: string;
  description: string;
  category: string;
  content: string;
  model?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateTemplatePayload {
  title?: string;
  description?: string;
  category?: string;
  content?: string;
  model?: string;
  tags?: string[];
  isPublic?: boolean;
}

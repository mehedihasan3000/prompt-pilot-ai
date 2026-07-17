export interface ScoreBreakdown {
  clarity: number;
  specificity: number;
  context: number;
  structure: number;
  constraints: number;
  overall: number;
}

export interface Variant {
  id: string;
  promptId: string;
  content: string;
  label: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  createdAt: string;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  content: string;
  goal?: string;
  model?: string;
  tags: string[];
  isFavorite: boolean;
  status: 'draft' | 'analyzed' | 'optimized' | 'completed';
  score?: number;
  scoreBreakdown?: ScoreBreakdown;
  originalContent?: string;
  variants: Variant[];
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptPayload {
  title: string;
  content: string;
  goal?: string;
  model?: string;
  tags?: string[];
  collectionId?: string;
}

export interface UpdatePromptPayload {
  title?: string;
  content?: string;
  goal?: string;
  model?: string;
  tags?: string[];
  isFavorite?: boolean;
  status?: 'draft' | 'analyzed' | 'optimized' | 'completed';
  collectionId?: string;
}

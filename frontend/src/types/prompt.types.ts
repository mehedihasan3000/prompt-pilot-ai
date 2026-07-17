export interface ScoreBreakdown {
  clarity: number;
  context: number;
  specificity: number;
  constraints: number;
  outputFormat: number;
  toneAlignment: number;
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
  originalPrompt: string;
  goal?: string;
  targetModel?: string;
  tone?: string;
  language?: string;
  outputLength?: string;
  outputFormat?: string;
  audience?: string;
  category: string;
  tags: string[];
  optimizedPrompt?: string;
  variants: Variant[];
  score?: number;
  scoreBreakdown?: ScoreBreakdown;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  followUpQuestions?: string[];
  favorite: boolean;
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptPayload {
  title: string;
  originalPrompt: string;
  goal?: string;
  targetModel?: string;
  tone?: string;
  language?: string;
  outputLength?: string;
  outputFormat?: string;
  audience?: string;
  category?: string;
  tags?: string[];
  collectionId?: string;
}

export interface UpdatePromptPayload {
  title?: string;
  originalPrompt?: string;
  goal?: string;
  targetModel?: string;
  tone?: string;
  language?: string;
  outputLength?: string;
  outputFormat?: string;
  audience?: string;
  category?: string;
  tags?: string[];
  favorite?: boolean;
  collectionId?: string;
}

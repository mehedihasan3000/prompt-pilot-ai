export interface AnalyticsSummary {
  totalPrompts: number;
  favoritePrompts: number;
  averageScore: number;
  totalTemplates: number;
  mostUsedModel: string | null;
  mostUsedCategory: string | null;
}

export interface PromptsOverTimeData {
  _id: string;
  count: number;
}

export interface CategoryUsageData {
  name: string;
  count: number;
  percentage: number;
}

export interface ModelUsageData {
  name: string;
  count: number;
  percentage: number;
}

export interface ScoreTrendData {
  date: string;
  averageScore: number;
  count: number;
}

export interface RecentActivityItem {
  _id: string;
  title: string;
  score: number;
  createdAt: string;
  targetModel: string;
}

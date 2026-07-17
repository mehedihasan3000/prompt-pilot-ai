export interface AnalyticsSummary {
  totalPrompts: number;
  totalOptimized: number;
  averageScore: number;
  totalCollections: number;
  totalTemplates: number;
  activeDays: number;
  streakDays: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PromptsOverTimeData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
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
  highestScore: number;
  lowestScore: number;
  count: number;
}

export interface AnalyticsFilter {
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  startDate?: string;
  endDate?: string;
}

'use client';

import { useRouter } from 'next/navigation';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Trophy,
  ArrowUp,
  Cpu,
  Music,
  Activity,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { ScoreOverTimeChart } from '@/components/charts/ScoreOverTimeChart';
import { PromptsPerWeekChart } from '@/components/charts/PromptsPerWeekChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ModelBarChart } from '@/components/charts/ModelBarChart';
import { ScoreByCategoryChart } from '@/components/charts/ScoreByCategoryChart';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import {
  useAnalyticsSummary,
  usePromptsOverTime,
  useCategoryUsage,
  useModelUsage,
  useScoreTrends,
  useRecentActivity,
} from '@/hooks/useAnalytics';

function MetricCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="flex-1">
          <Skeleton className="mb-1 h-3 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

function ChartSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function getScoreColor(score?: number) {
  if (score == null) return 'bg-slate-400';
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const summary = useAnalyticsSummary();
  const promptsOverTime = usePromptsOverTime();
  const categoryUsage = useCategoryUsage();
  const modelUsage = useModelUsage();
  const scoreTrends = useScoreTrends();
  const recentActivity = useRecentActivity();

  const isLoading = summary.isLoading || promptsOverTime.isLoading || categoryUsage.isLoading || modelUsage.isLoading || scoreTrends.isLoading || recentActivity.isLoading;
  const isError = summary.isError || promptsOverTime.isError || categoryUsage.isError || modelUsage.isError || scoreTrends.isError || recentActivity.isError;
  const refetchAll = () => {
    summary.refetch();
    promptsOverTime.refetch();
    categoryUsage.refetch();
    modelUsage.refetch();
    scoreTrends.refetch();
    recentActivity.refetch();
  };

  const hasData = summary.data && summary.data.totalPrompts > 0;

  const highestScore = recentActivity.data
    ? Math.max(...recentActivity.data.map((a) => a.score ?? 0), 0)
    : 0;

  const mostImproved = (() => {
    if (!scoreTrends.data || scoreTrends.data.length < 2) return null;
    const sorted = [...scoreTrends.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0].averageScore;
    const last = sorted[sorted.length - 1].averageScore;
    const change = last - first;
    if (change <= 0) return null;
    return `+${change.toFixed(1)}`;
  })();

  const scoreByCategory = [
    { name: 'Clarity', score: 0 },
    { name: 'Context', score: 0 },
    { name: 'Specificity', score: 0 },
    { name: 'Constraints', score: 0 },
    { name: 'Format', score: 0 },
    { name: 'Tone', score: 0 },
  ];

  const mostUsedTone = categoryUsage.data
    ? categoryUsage.data.reduce((best, curr) => (curr.count > best.count ? curr : best), categoryUsage.data[0])
    : null;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Analytics</h1>
              <p className="mt-1 text-sm text-slate-500">
                Detailed insights into your prompt performance and usage patterns.
              </p>
            </div>

            {isLoading && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => <MetricCardSkeleton key={i} />)}
                </div>
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="chart" />)}
                </div>
              </>
            )}

            {isError && !isLoading && (
              <ErrorState
                title="Failed to load analytics"
                message="An error occurred while fetching your analytics data."
                onRetry={refetchAll}
              />
            )}

            {!isLoading && !isError && !hasData && (
              <EmptyState
                icon={BarChart3}
                title="No analytics data yet"
                description="Start analyzing prompts to see detailed analytics and insights."
                action={{ label: 'Go to Workspace', onClick: () => router.push('/workspace') }}
              />
            )}

            {!isLoading && !isError && hasData && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard
                    icon={FileText}
                    label="Total Prompts"
                    value={summary.data?.totalPrompts ?? 0}
                    color="bg-indigo-500"
                  />
                  <MetricCard
                    icon={TrendingUp}
                    label="Average Score"
                    value={summary.data?.averageScore ?? 'N/A'}
                    color={getScoreColor(summary.data?.averageScore)}
                  />
                  <MetricCard
                    icon={Trophy}
                    label="Highest Scoring Prompt"
                    value={highestScore > 0 ? highestScore : 'N/A'}
                    color="bg-amber-500"
                  />
                  <MetricCard
                    icon={ArrowUp}
                    label="Most Improved"
                    value={mostImproved ?? 'N/A'}
                    color="bg-emerald-500"
                  />
                  <MetricCard
                    icon={Cpu}
                    label="Most Used Model"
                    value={summary.data?.mostUsedModel ?? 'N/A'}
                    color="bg-cyan-500"
                  />
                  <MetricCard
                    icon={Music}
                    label="Most Used Tone"
                    value={mostUsedTone?.name ?? 'N/A'}
                    color="bg-violet-500"
                  />
                </div>

                <div className="space-y-6">
                  <ChartSection
                    title="Prompt Score Over Time"
                    description="Average prompt scores over time, showing quality trends."
                  >
                    {scoreTrends.data && scoreTrends.data.length > 0 ? (
                      <ScoreOverTimeChart data={scoreTrends.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No score data available yet.</p>
                    )}
                  </ChartSection>

                  <ChartSection
                    title="Prompts Created Per Week"
                    description="Number of prompts created over time."
                  >
                    {promptsOverTime.data && promptsOverTime.data.length > 0 ? (
                      <PromptsPerWeekChart data={promptsOverTime.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No prompt data available yet.</p>
                    )}
                  </ChartSection>

                  <ChartSection
                    title="Category Usage Distribution"
                    description="Breakdown of prompts by category."
                  >
                    {categoryUsage.data && categoryUsage.data.length > 0 ? (
                      <CategoryPieChart data={categoryUsage.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No category data available yet.</p>
                    )}
                  </ChartSection>

                  <ChartSection
                    title="Target AI Model Usage"
                    description="Distribution of prompts across different AI models."
                  >
                    {modelUsage.data && modelUsage.data.length > 0 ? (
                      <ModelBarChart data={modelUsage.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No model data available yet.</p>
                    )}
                  </ChartSection>

                  <ChartSection
                    title="Average Score by Category"
                    description="Average quality scores across different scoring dimensions."
                  >
                    <ScoreByCategoryChart data={scoreByCategory} />
                  </ChartSection>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, BookOpen, Heart, Cpu, Folder, ArrowRight, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScoreOverTimeChart } from '@/components/charts/ScoreOverTimeChart';
import { PromptsPerWeekChart } from '@/components/charts/PromptsPerWeekChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { ModelBarChart } from '@/components/charts/ModelBarChart';
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

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">{value ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
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

function getScoreColor(score?: number) {
  if (score == null) return 'bg-slate-400';
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getScoreBadgeVariant(score?: number) {
  if (score == null) return 'default' as const;
  if (score >= 80) return 'success' as const;
  if (score >= 60) return 'warning' as const;
  return 'danger' as const;
}

export default function DashboardPage() {
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Here&apos;s an overview of your prompt analytics.
              </p>
            </div>

            {isLoading && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
                </div>
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <Skeleton variant="chart" />
                  <Skeleton variant="chart" />
                </div>
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <Skeleton variant="chart" />
                  <Skeleton variant="chart" />
                </div>
              </>
            )}

            {isError && !isLoading && (
              <ErrorState
                title="Failed to load dashboard"
                message="An error occurred while fetching your analytics data."
                onRetry={refetchAll}
              />
            )}

            {!isLoading && !isError && !hasData && (
              <EmptyState
                icon={FileText}
                title="No analytics data yet"
                description="Start analyzing prompts to see your dashboard metrics and charts."
                action={{ label: 'Go to Workspace', onClick: () => router.push('/workspace') }}
              />
            )}

            {!isLoading && !isError && hasData && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard
                    icon={FileText}
                    label="Total Prompts"
                    value={summary.data?.totalPrompts ?? 0}
                    color="bg-indigo-500"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Average Score"
                    value={summary.data?.averageScore ?? 'N/A'}
                    color={getScoreColor(summary.data?.averageScore)}
                  />
                  <StatCard
                    icon={BookOpen}
                    label="Saved Templates"
                    value={summary.data?.totalTemplates ?? 0}
                    color="bg-emerald-500"
                  />
                  <StatCard
                    icon={Heart}
                    label="Favorite Prompts"
                    value={summary.data?.favoritePrompts ?? 0}
                    color="bg-rose-500"
                  />
                  <StatCard
                    icon={Cpu}
                    label="Most Used Model"
                    value={summary.data?.mostUsedModel ?? 'N/A'}
                    color="bg-cyan-500"
                  />
                  <StatCard
                    icon={Folder}
                    label="Most Used Category"
                    value={summary.data?.mostUsedCategory ?? 'N/A'}
                    color="bg-amber-500"
                  />
                </div>

                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Score Over Time</h3>
                    {scoreTrends.data && scoreTrends.data.length > 0 ? (
                      <ScoreOverTimeChart data={scoreTrends.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No score data available yet.</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Prompts Per Day</h3>
                    {promptsOverTime.data && promptsOverTime.data.length > 0 ? (
                      <PromptsPerWeekChart data={promptsOverTime.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No prompt data available yet.</p>
                    )}
                  </div>
                </div>

                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Category Usage</h3>
                    {categoryUsage.data && categoryUsage.data.length > 0 ? (
                      <CategoryPieChart data={categoryUsage.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No category data available yet.</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Model Usage</h3>
                    {modelUsage.data && modelUsage.data.length > 0 ? (
                      <ModelBarChart data={modelUsage.data} />
                    ) : (
                      <p className="py-12 text-center text-sm text-slate-400">No model data available yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/history')}>
                      View All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  {recentActivity.data && recentActivity.data.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {recentActivity.data.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                            <Clock className="h-4 w-4 text-indigo-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getScoreBadgeVariant(item.score)}>
                              {item.score ?? 'N/A'}
                            </Badge>
                            <Badge variant="default">{item.targetModel || 'Any'}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-6 py-8 text-center text-sm text-slate-400">
                      No recent activity yet.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

    </div>
    </ProtectedRoute>
  );
}

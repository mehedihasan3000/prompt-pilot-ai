'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, SlidersHorizontal, Heart, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { usePrompts, useDeletePrompt, useToggleFavorite } from '@/hooks/usePrompts';
import type { Prompt } from '@/types/prompt.types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest_score', label: 'Highest Score' },
  { value: 'lowest_score', label: 'Lowest Score' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'other', label: 'Other' },
];

const MODEL_OPTIONS = [
  { value: '', label: 'All Models' },
  { value: 'ChatGPT', label: 'ChatGPT' },
  { value: 'Claude', label: 'Claude' },
  { value: 'Gemini', label: 'Gemini' },
  { value: 'Llama', label: 'Llama' },
  { value: 'Other', label: 'Other' },
];

export default function HistoryPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [targetModel, setTargetModel] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error, refetch } = usePrompts({
    search: search || undefined,
    category: category || undefined,
    targetModel: targetModel || undefined,
    sort,
    page,
    limit,
  });

  const deleteMutation = useDeletePrompt();
  const toggleFavoriteMutation = useToggleFavorite();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const prompts: Prompt[] = data?.prompts || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / limit) || 1;

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast('Prompt deleted', 'success');
      setDeleteId(null);
    } catch {
      toast('Failed to delete prompt', 'error');
    }
  }, [deleteId, deleteMutation]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    try {
      await toggleFavoriteMutation.mutateAsync(id);
      toast('Favorite updated', 'success');
    } catch {
      toast('Failed to update favorite', 'error');
    }
  }, [toggleFavoriteMutation]);

  function getScoreColor(score?: number) {
    if (!score) return 'text-slate-400';
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  }

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Prompt History</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all your past prompt analyses.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title..."
            className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-40"
          />
          <Select
            options={MODEL_OPTIONS}
            value={targetModel}
            onChange={(e) => { setTargetModel(e.target.value); setPage(1); }}
            className="w-40"
          />
          <div className="ml-auto">
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-40"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Failed to load history"
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && prompts.length === 0 && (
        <EmptyState
          icon={Search}
          title="No prompts yet"
          description="Your analyzed prompts will appear here."
          action={{ label: 'Go to Workspace', onClick: () => router.push('/workspace') }}
        />
      )}

      {!isLoading && !isError && prompts.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Score</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Model</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prompts.map((p,idx) => (
                  <tr
                    key={idx}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => router.push(`/prompts/${p.id}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 line-clamp-1">{p.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getScoreColor(p.score)}`}>
                        {p.score ?? 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.targetModel || 'Any'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{p.category || 'Uncategorized'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(p.id); }}
                          className={`rounded-lg p-1.5 transition-colors ${
                            p.favorite
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${p.favorite ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages} ({total} total)
            </span>
          </div>
        </>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Prompt"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this prompt? This action cannot be undone.
        </p>
      </Modal>
    </div>
    </ProtectedRoute>
  );
}
'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Layers, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { useTemplates } from '@/hooks/useTemplates';
import type { Template } from '@/types/template.types';

const PAGE_SIZES = [
  { value: '8', label: '8 per page' },
  { value: '12', label: '12 per page' },
  { value: '16', label: '16 per page' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'usage', label: 'Most Used' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
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

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All Difficulties' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

function ExploreFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-1 h-4 w-72 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [targetModel, setTargetModel] = useState(searchParams.get('targetModel') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 12);

  const { data, isLoading, isError, error, refetch } = useTemplates({
    search: search || undefined,
    category: category || undefined,
    targetModel: targetModel || undefined,
    difficulty: difficulty || undefined,
    sort,
    page,
    limit,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (targetModel) params.set('targetModel', targetModel);
    if (difficulty) params.set('difficulty', difficulty);
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    if (limit !== 12) params.set('limit', String(limit));
    const qs = params.toString();
    router.replace(`/explore${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [search, category, targetModel, difficulty, sort, page, limit, router]);

  const templates: Template[] = data?.templates || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / limit) || 1;

  const handleView = useCallback((id: string) => {
    router.push(`/templates/${id}`);
  }, [router]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Explore Templates</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover prompt templates created by the community.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search templates..."
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
          <Select
            options={DIFFICULTY_OPTIONS}
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Failed to load templates"
          message={(error as Error)?.message || 'An error occurred'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && templates.length === 0 && (
        <EmptyState
          icon={Layers}
          title="No templates found"
          description="Try adjusting your search or filter criteria."
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setCategory(''); setTargetModel(''); setDifficulty(''); setSort('newest'); setPage(1); } }}
        />
      )}

      {!isLoading && !isError && templates.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t: Template) => (
              <TemplateCard key={t.id} template={t} onView={handleView} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Show</span>
              <Select
                options={PAGE_SIZES}
                value={String(limit)}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="w-32"
              />
            </div>

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
                const isCurrent = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
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
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreContent />
    </Suspense>
  );
}
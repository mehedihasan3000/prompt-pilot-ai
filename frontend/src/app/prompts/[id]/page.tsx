'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Copy, Check, Trash2, Heart, Star,
  ThumbsUp, ThumbsDown, Lightbulb, RefreshCw, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { ScoreRing } from '@/components/ai/ScoreRing';
import { toast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { usePrompt, useDeletePrompt, useToggleFavorite } from '@/hooks/usePrompts';
import { analyzePrompt } from '@/services/api/ai';

function ScoreBreakdownChart({ scores }: { scores: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-3">
      {scores.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.value}/{item.max}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PromptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading: authLoading } = useCurrentUser();
  const { data: prompt, isLoading, isError, error, refetch } = usePrompt(id);
  const deleteMutation = useDeletePrompt();
  const toggleFavoriteMutation = useToggleFavorite();

  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reoptimizing, setReoptimizing] = useState(false);

  const handleCopy = useCallback(async (text: string, type: 'original' | 'optimized') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'original') {
        setCopiedOriginal(true);
        setTimeout(() => setCopiedOriginal(false), 2000);
      } else {
        setCopiedOptimized(true);
        setTimeout(() => setCopiedOptimized(false), 2000);
      }
      toast('Copied to clipboard', 'success');
    } catch {
      toast('Failed to copy', 'error');
    }
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast('Prompt deleted', 'success');
      router.push('/history');
    } catch {
      toast('Failed to delete prompt', 'error');
    }
  }, [id, deleteMutation, router]);

  const handleToggleFavorite = useCallback(async () => {
    try {
      await toggleFavoriteMutation.mutateAsync(id);
      toast('Favorite updated', 'success');
    } catch {
      toast('Failed to update favorite', 'error');
    }
  }, [id, toggleFavoriteMutation]);

  const handleReoptimize = useCallback(async () => {
    if (!prompt) return;
    setReoptimizing(true);
    try {
      const response = await analyzePrompt({
        originalPrompt: prompt.originalPrompt,
        goal: prompt.goal || '',
        targetModel: prompt.targetModel || '',
        tone: prompt.tone || '',
        language: prompt.language || 'English',
        outputLength: prompt.outputLength || 'medium',
        outputFormat: prompt.outputFormat || 'text',
        audience: prompt.audience,
        category: prompt.category,
      });
      if (response.success && response.data) {
        toast('Re-optimization completed!', 'success');
        refetch();
      } else {
        toast(response.error || 'Re-optimization failed', 'error');
      }
    } catch {
      toast('Re-optimization failed', 'error');
    } finally {
      setReoptimizing(false);
    }
  }, [prompt, refetch]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError || !prompt) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Prompt not found"
          message={(error as Error)?.message || 'Could not load this prompt.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const scoreItems = prompt.scoreBreakdown
    ? [
        { label: 'Clarity', value: prompt.scoreBreakdown.clarity, max: 100 },
        { label: 'Context', value: prompt.scoreBreakdown.context, max: 100 },
        { label: 'Specificity', value: prompt.scoreBreakdown.specificity, max: 100 },
        { label: 'Constraints', value: prompt.scoreBreakdown.constraints, max: 100 },
        { label: 'Output Format', value: prompt.scoreBreakdown.outputFormat, max: 100 },
        { label: 'Tone Alignment', value: prompt.scoreBreakdown.toneAlignment, max: 100 },
      ]
    : [];

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push('/history')}
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{prompt.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`rounded-lg p-2 transition-colors ${
              prompt.favorite
                ? 'text-red-500 hover:bg-red-50'
                : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Heart className={`h-5 w-5 ${prompt.favorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {prompt.category && <Badge variant="default">{prompt.category}</Badge>}
        {prompt.targetModel && <Badge variant="default">{prompt.targetModel}</Badge>}
        {prompt.score != null && (
          <Badge variant={prompt.score >= 80 ? 'success' : prompt.score >= 60 ? 'warning' : 'danger'}>
            Score: {prompt.score}
          </Badge>
        )}
        {prompt.tone && <Badge variant="default">{prompt.tone}</Badge>}
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Original Prompt</h2>
          <Button variant="ghost" size="sm" onClick={() => handleCopy(prompt.originalPrompt, 'original')}>
            {copiedOriginal ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedOriginal ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap border border-slate-200">
          {prompt.originalPrompt}
        </pre>
      </div>

      {prompt.optimizedPrompt && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Optimized Prompt</h2>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(prompt.optimizedPrompt!, 'optimized')}>
              {copiedOptimized ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedOptimized ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-green-50 p-4 text-sm text-green-800 whitespace-pre-wrap border border-green-200">
            {prompt.optimizedPrompt}
          </pre>
        </div>
      )}

      {prompt.variants && prompt.variants.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Variants ({prompt.variants.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {prompt.variants.map((variant, i) => (
              <div
                key={variant.id || i}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{variant.label}</span>
                  <span className="text-xs font-medium text-slate-500">Score: {variant.score}</span>
                </div>
                <pre className="overflow-x-auto rounded bg-slate-50 p-3 text-xs text-slate-600 whitespace-pre-wrap max-h-32">
                  {variant.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-center">
            <ScoreRing score={prompt.score || 0} size="md" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <Star className="h-5 w-5 text-amber-400" />
            Score Breakdown
          </h3>
          {scoreItems.length > 0 ? (
            <ScoreBreakdownChart scores={scoreItems} />
          ) : (
            <p className="text-sm text-slate-500">No score data available.</p>
          )}
        </div>
      </div>

      {prompt.strengths && prompt.strengths.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {prompt.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prompt.weaknesses && prompt.weaknesses.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            Weaknesses
          </h3>
          <ul className="space-y-2">
            {prompt.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prompt.recommendations && prompt.recommendations.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {prompt.recommendations.map((r, i) => (
              <li key={i} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{r.title}</span>
                  {r.priority && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.priority === 'high' ? 'bg-red-100 text-red-700' :
                      r.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{r.priority}</span>
                  )}
                </div>
                {r.description && <p className="mt-1 text-sm text-slate-600">{r.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prompt.followUpQuestions && prompt.followUpQuestions.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
            <MessageSquare className="h-5 w-5 text-primary-500" />
            Follow-up Questions
          </h3>
          <ul className="space-y-2">
            {prompt.followUpQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                  {i + 1}
                </span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleReoptimize} isLoading={reoptimizing}>
          <RefreshCw className="h-4 w-4" />
          Re-optimize
        </Button>
        <Button variant="ghost" onClick={() => router.push('/history')}>
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Prompt"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
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
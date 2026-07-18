'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Star, Copy, Check, BarChart3,
  Bookmark, Heart, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { toast } from '@/components/ui/Toast';
import { useTemplate } from '@/hooks/useTemplates';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { getTemplates, incrementTemplateUsage } from '@/services/api/templates';
import { getTemplateReviews, createTemplateReview } from '@/services/api/reviews';
import type { Template } from '@/types/template.types';
import type { Review } from '@/services/api/reviews';

const RATING_OPTIONS = [
  { value: '5', label: '5 - Excellent' },
  { value: '4', label: '4 - Good' },
  { value: '3', label: '3 - Average' },
  { value: '2', label: '2 - Poor' },
  { value: '1', label: '1 - Terrible' },
];

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: user } = useCurrentUser();
  const { data: template, isLoading, isError, error, refetch } = useTemplate(id);

  const [copied, setCopied] = useState(false);
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [relatedTemplates, setRelatedTemplates] = useState<Template[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [reviewsRes, relatedRes] = await Promise.all([
          getTemplateReviews(id),
          getTemplates({ category: template?.category, limit: 4 }),
        ]);
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
        }
        if (relatedRes.success && relatedRes.data) {
          setRelatedTemplates(
            relatedRes.data.templates.filter((t) => t.id !== id).slice(0, 4)
          );
        }
      } catch (err) {
        toast('Failed to load reviews', 'error');
        console.error(err);
      } finally {
        setReviewsLoading(false);
        setRelatedLoading(false);
      }
    }
    if (template) {
      load();
    }
  }, [template?.category, id]);

  const handleCopy = useCallback(async () => {
    if (!template) return;
    try {
      await navigator.clipboard.writeText(template.promptContent);
      setCopied(true);
      toast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy', 'error');
    }
  }, [template]);

  const handleUseTemplate = useCallback(async () => {
    if (!template) return;
    try {
      await incrementTemplateUsage(id);
      await navigator.clipboard.writeText(template.promptContent);
      toast('Template content copied! Ready to use.', 'success');
    } catch {
      toast('Failed to use template', 'error');
    }
  }, [template, id]);

  const handleSubmitReview = useCallback(async () => {
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await createTemplateReview(id, {
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      if (res.success && res.data) {
        setReviews((prev) => [...prev, res.data!]);
        setReviewComment('');
        setReviewRating('5');
        toast('Review submitted!', 'success');
      } else {
        toast(res.error || 'Failed to submit review', 'error');
      }
    } catch {
      toast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  }, [id, reviewRating, reviewComment]);

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

  if (isError || !template) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Template not found"
          message={(error as Error)?.message || 'Could not load this template.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{template.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{template.shortDescription}</p>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Key Information</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Category</p>
            <Badge variant="default">{template.category}</Badge>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Target Model</p>
            <p className="text-sm font-medium text-slate-700">{template.targetModel || 'Any'}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Difficulty</p>
            <p className="text-sm font-medium text-slate-700">{template.difficulty}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Rating</p>
            <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {template.averageRating.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Tone</p>
            <p className="text-sm font-medium text-slate-700">{template.tone || 'Any'}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Output Type</p>
            <p className="text-sm font-medium text-slate-700">{template.outputType || 'Any'}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Created</p>
            <p className="text-sm font-medium text-slate-700">
              {new Date(template.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400 uppercase">Usage</p>
            <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
              <BarChart3 className="h-4 w-4 text-slate-400" />
              {template.usageCount} times
            </p>
          </div>
        </div>
      </div>

      {template.fullDescription && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Description</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{template.fullDescription}</p>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Prompt Content</h2>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100 whitespace-pre-wrap">
          {template.promptContent}
        </pre>
      </div>

      {template.tags.length > 0 && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {user && (
        <div className="mb-8 flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleUseTemplate}>
            <Send className="h-4 w-4" />
            Use Template
          </Button>
          <Button variant="secondary">
            <Bookmark className="h-4 w-4" />
            Save to Collection
          </Button>
          <Button variant="ghost">
            <Heart className="h-4 w-4" />
            Add to Favorites
          </Button>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Reviews</h2>

        {reviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="mb-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{review.userName}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Write a Review</h3>
            <div className="space-y-3">
              <Select
                options={RATING_OPTIONS}
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                label="Rating"
              />
              <Textarea
                label="Comment"
                placeholder="Share your experience with this template..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitReview}
                isLoading={submittingReview}
                disabled={!reviewComment.trim()}
              >
                <Send className="h-4 w-4" />
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </div>

      {!relatedLoading && relatedTemplates.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Related Templates</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onView={(tid) => router.push(`/templates/${tid}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
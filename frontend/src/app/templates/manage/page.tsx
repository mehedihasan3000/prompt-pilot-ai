'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCurrentUser } from '@/hooks/useAuth';
import { useTemplates, useDeleteTemplate } from '@/hooks/useTemplates';
import type { Template } from '@/types/template.types';

export default function ManageTemplatesPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, error, refetch } = useTemplates({ userId: user?.id, sort: 'newest' });
  const deleteMutation = useDeleteTemplate();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const templates: Template[] = data?.templates || [];

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast('Template deleted', 'success');
      setDeleteId(null);
    } catch {
      toast('Failed to delete template', 'error');
    }
  }, [deleteId, deleteMutation]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Failed to load templates"
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Templates</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your created prompt templates.
          </p>
        </div>
        <Button onClick={() => router.push('/templates/add')}>
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No templates yet"
          description="Create your first template to share with the community."
          action={{ label: 'Create Template', onClick: () => router.push('/templates/add') }}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Title</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Model</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Visibility</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 line-clamp-1">{t.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{t.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.targetModel}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {t.averageRating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.visibility === 'public' ? 'success' : 'default'}>
                      {t.visibility}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/templates/${t.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteId(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Template"
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
          Are you sure you want to delete this template? This action cannot be undone.
        </p>
      </Modal>
    </div>
    </ProtectedRoute>
  );
}
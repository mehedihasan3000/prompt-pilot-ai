'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderOpen, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  FileText, X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { useCurrentUser } from '@/hooks/useAuth';
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/hooks/useCollections';
import { getCollection, removePromptFromCollection } from '@/services/api/collections';
import type { Collection } from '@/types/collection.types';
import type { Prompt } from '@/types/prompt.types';

const COLOR_OPTIONS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6',
];

export default function CollectionsPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const { data: collections, isLoading, isError, error, refetch } = useCollections();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  const allCollections: Collection[] = collections || [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Prompt[]>([]);
  const [expandedLoading, setExpandedLoading] = useState(false);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#3b82f6');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setFormName('');
    setFormDescription('');
    setFormColor('#3b82f6');
    setFormErrors({});
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((collection: Collection) => {
    setFormName(collection.name);
    setFormDescription(collection.description || '');
    setFormColor(collection.color || '#3b82f6');
    setFormErrors({});
    setEditingCollection(collection);
  }, []);

  const handleCreate = useCallback(async () => {
    const newErrors: Record<string, string> = {};
    if (!formName.trim()) newErrors.name = 'Name is required';
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        color: formColor,
      });
      toast('Collection created!', 'success');
      setShowCreateModal(false);
      resetForm();
    } catch {
      toast('Failed to create collection', 'error');
    }
  }, [formName, formDescription, formColor, createMutation, resetForm]);

  const handleUpdate = useCallback(async () => {
    if (!editingCollection) return;
    const newErrors: Record<string, string> = {};
    if (!formName.trim()) newErrors.name = 'Name is required';
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateMutation.mutateAsync({
        id: editingCollection.id,
        payload: {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          color: formColor,
        },
      });
      toast('Collection updated!', 'success');
      setEditingCollection(null);
      resetForm();
    } catch {
      toast('Failed to update collection', 'error');
    }
  }, [editingCollection, formName, formDescription, formColor, updateMutation, resetForm]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast('Collection deleted', 'success');
      setDeleteId(null);
      if (expandedId === deleteId) {
        setExpandedId(null);
        setExpandedPrompts([]);
      }
    } catch {
      toast('Failed to delete collection', 'error');
    }
  }, [deleteId, deleteMutation, expandedId]);

  const handleToggleExpand = useCallback(async (collectionId: string) => {
    if (expandedId === collectionId) {
      setExpandedId(null);
      setExpandedPrompts([]);
      return;
    }

    setExpandedId(collectionId);
    setExpandedLoading(true);
    try {
      const result = await getCollection(collectionId);
      if (result.success && result.data) {
        setExpandedPrompts(result.data.prompts || []);
      }
    } catch {
      setExpandedPrompts([]);
    } finally {
      setExpandedLoading(false);
    }
  }, [expandedId]);

  const handleRemovePrompt = useCallback(async (promptId: string) => {
    if (!expandedId) return;
    try {
      await removePromptFromCollection(expandedId, promptId);
      setExpandedPrompts((prev) => prev.filter((p) => p.id !== promptId));
      refetch();
      toast('Prompt removed from collection', 'success');
    } catch {
      toast('Failed to remove prompt', 'error');
    }
  }, [expandedId, refetch]);

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">Sign in required</h1>
        <p className="mb-6 text-slate-500">You need to be signed in to manage collections.</p>
        <Button onClick={() => router.push('/login')}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Failed to load collections"
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Collections</h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize your prompts into themed collections.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Create Collection
        </Button>
      </div>

      {allCollections.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          description="Create your first collection to start organizing your prompts."
          action={{ label: 'Create Collection', onClick: handleOpenCreate }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allCollections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg"
            >
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: collection.color || '#3b82f6', opacity: 0.15 }}
                  >
                    <FolderOpen
                      className="h-5 w-5"
                      style={{ color: collection.color || '#3b82f6' }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(collection)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(collection.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="mb-1 text-base font-semibold text-slate-900">{collection.name}</h3>
                {collection.description && (
                  <p className="mb-3 text-sm text-slate-500 line-clamp-2">{collection.description}</p>
                )}

                <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {collection.promptCount} prompts
                  </span>
                  <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: collection.color || '#3b82f6' }}
                  />
                  <span className="text-xs text-slate-400 capitalize">{collection.color || 'Default'}</span>
                </div>
              </div>

              <button
                onClick={() => handleToggleExpand(collection.id)}
                className="flex w-full items-center justify-center gap-1 border-t border-slate-100 px-5 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                {expandedId === collection.id ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Hide Prompts
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    View Prompts
                  </>
                )}
              </button>

              {expandedId === collection.id && (
                <div className="border-t border-slate-100 px-5 py-3">
                  {expandedLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-8 animate-pulse rounded bg-slate-100" />
                      ))}
                    </div>
                  ) : expandedPrompts.length === 0 ? (
                    <p className="py-2 text-center text-xs text-slate-400">No prompts in this collection.</p>
                  ) : (
                    <div className="space-y-2">
                      {expandedPrompts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                        >
                          <button
                            onClick={() => router.push(`/prompts/${p.id}`)}
                            className="flex-1 text-left text-sm font-medium text-slate-700 hover:text-primary-600 line-clamp-1"
                          >
                            {p.title}
                          </button>
                          <button
                            onClick={() => handleRemovePrompt(p.id)}
                            className="ml-2 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="Create Collection"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} isLoading={createMutation.isPending}>
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g., Writing Prompts"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formErrors.name}
          />
          <Textarea
            label="Description"
            placeholder="Brief description of this collection..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    formColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!editingCollection}
        onClose={() => { setEditingCollection(null); resetForm(); }}
        title="Edit Collection"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setEditingCollection(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdate} isLoading={updateMutation.isPending}>
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g., Writing Prompts"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formErrors.name}
          />
          <Textarea
            label="Description"
            placeholder="Brief description of this collection..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    formColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Collection"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this collection? Prompts inside will not be deleted.
        </p>
      </Modal>
    </div>
  );
}
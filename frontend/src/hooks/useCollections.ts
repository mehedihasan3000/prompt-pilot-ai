'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as collectionsApi from '@/services/api/collections';
import type { Collection, CreateCollectionPayload, UpdateCollectionPayload } from '@/types/collection.types';

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const result = await collectionsApi.getCollections();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch collections');
      }
      return result.data as Collection[];
    },
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: async () => {
      const result = await collectionsApi.getCollection(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch collection');
      }
      return result.data as Collection;
    },
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) => collectionsApi.createCollection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCollectionPayload }) =>
      collectionsApi.updateCollection(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionsApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

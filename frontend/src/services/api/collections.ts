import { apiFetch } from '@/lib/api';
import type { Collection, CreateCollectionPayload, UpdateCollectionPayload } from '@/types/collection.types';

export function getCollections() {
  return apiFetch<Collection[]>('/collections');
}

export function getCollection(id: string) {
  return apiFetch<Collection>(`/collections/${id}`);
}

export function createCollection(payload: CreateCollectionPayload) {
  return apiFetch<Collection>('/collections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCollection(id: string, payload: UpdateCollectionPayload) {
  return apiFetch<Collection>(`/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCollection(id: string) {
  return apiFetch<void>(`/collections/${id}`, {
    method: 'DELETE',
  });
}

export function addPrompt(collectionId: string, promptId: string) {
  return apiFetch<Collection>(`/collections/${collectionId}/prompts`, {
    method: 'POST',
    body: JSON.stringify({ promptId }),
  });
}

export function removePrompt(collectionId: string, promptId: string) {
  return apiFetch<Collection>(`/collections/${collectionId}/prompts/${promptId}`, {
    method: 'DELETE',
  });
}

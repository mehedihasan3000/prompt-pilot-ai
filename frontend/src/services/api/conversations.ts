import { apiFetch } from '@/lib/api';
import type { ChatMessage } from '@/types/ai.types';

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export function getConversations() {
  return apiFetch<Conversation[]>('/conversations');
}

export function getConversation(id: string) {
  return apiFetch<{ conversation: Conversation; messages: ChatMessage[] }>(
    `/conversations/${id}`
  );
}

export function createConversation(title?: string) {
  return apiFetch<Conversation>('/conversations', {
    method: 'POST',
    body: JSON.stringify({ title: title || 'New Chat' }),
  });
}

export function deleteConversation(id: string) {
  return apiFetch<void>(`/conversations/${id}`, {
    method: 'DELETE',
  });
}

export function getMessages(conversationId: string) {
  return apiFetch<ChatMessage[]>(`/conversations/${conversationId}/messages`);
}

'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types/ai.types';
import { sendChatMessage } from '@/services/api/ai';

interface UseChatReturn {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setConversationId: (id: string | null) => void;
}

export function useChat(initialConversationId?: string | null): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsSending(true);
      setError(null);

      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const result = await sendChatMessage(conversationId, content);

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to send message');
        }

        const { reply, conversationId: newConvId } = result.data;

        if (!conversationId && newConvId) {
          setConversationId(newConvId);
        }

        setMessages((prev) => [...prev, reply]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsSending(false);
      }
    },
    [conversationId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    isSending,
    error,
    sendMessage,
    clearMessages,
    setConversationId,
  };
}

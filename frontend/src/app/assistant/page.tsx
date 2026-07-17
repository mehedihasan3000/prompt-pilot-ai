'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Trash2,
  Menu,
  X,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useCurrentUser } from '@/hooks/useAuth';
import { ChatBubble } from '@/components/ai/ChatBubble';
import { ChatInput } from '@/components/ai/ChatInput';
import { TypingIndicator } from '@/components/ai/TypingIndicator';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonRow } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
} from '@/services/api/conversations';
import type { Conversation } from '@/services/api/conversations';
import type { ChatMessage } from '@/types/ai.types';

const DEFAULT_FOLLOW_UPS = [
  'Why is my prompt weak?',
  'Rewrite this for Claude',
  'Make this prompt beginner-friendly',
  'Add examples to this prompt',
  'Improve the output format',
  'Make this prompt shorter',
];

export default function AssistantPage() {
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUser();
  const { messages, isSending, error: chatError, sendMessage, clearMessages, setMessages } = useChat();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>(DEFAULT_FOLLOW_UPS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    setConversationsError(null);
    try {
      const res = await getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
      } else {
        setConversationsError(res.error || 'Failed to load conversations');
      }
    } catch {
      setConversationsError('Failed to load conversations');
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleNewChat = useCallback(async () => {
    setIsCreating(true);
    try {
      const res = await createConversation();
      if (res.success && res.data) {
        setConversations((prev) => [res.data!, ...prev]);
        setActiveConversationId(res.data.id);
        clearMessages();
        setSuggestedFollowUps(DEFAULT_FOLLOW_UPS);
        setShowMobileList(false);
      }
    } catch {
    } finally {
      setIsCreating(false);
    }
  }, [clearMessages]);

  const handleDeleteConversation = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const res = await deleteConversation(id);
        if (res.success) {
          setConversations((prev) => prev.filter((c) => c.id !== id));
          if (activeConversationId === id) {
            setActiveConversationId(null);
            clearMessages();
          }
        }
      } catch {
      }
    },
    [activeConversationId, clearMessages]
  );

  const handleSelectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      setShowMobileList(false);
      setSuggestedFollowUps(DEFAULT_FOLLOW_UPS);
      try {
        const res = await getMessages(id);
        if (res.success && res.data) {
          setMessages(res.data);
        }
      } catch {
      }
    },
    [setMessages]
  );

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
      setSuggestedFollowUps([]);
    },
    [sendMessage]
  );

  const handleSelectFollowUp = useCallback(
    (question: string) => {
      handleSend(question);
      setSuggestedFollowUps([]);
    },
    [handleSend]
  );

  const showTyping = isSending && messages[messages.length - 1]?.role === 'user';

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex flex-1 lg:pl-64">
          <div className="flex h-[calc(100vh-64px)] w-full">
            <div
              className={`${
                showMobileList ? 'flex' : 'hidden'
              } absolute inset-0 z-20 flex-col border-r border-slate-200 bg-white md:relative md:flex md:w-[280px] md:shrink-0`}
            >
              <div className="border-b border-slate-200 p-4">
                <div className="mb-4 flex items-center justify-between md:hidden">
                  <h2 className="text-sm font-semibold text-slate-900">Conversations</h2>
                  <button
                    onClick={() => setShowMobileList(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={handleNewChat}
                  isLoading={isCreating}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversationsLoading && (
                  <div className="space-y-1 p-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="rounded-lg p-3">
                        <Skeleton variant="text" className="mb-2 h-4 w-3/4" />
                        <Skeleton variant="text" className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                )}

                {conversationsError && (
                  <ErrorState
                    title="Failed to load"
                    message={conversationsError}
                    onRetry={fetchConversations}
                  />
                )}

                {!conversationsLoading && !conversationsError && conversations.length === 0 && (
                  <EmptyState
                    icon={MessageSquare}
                    title="No conversations"
                    description="Start a new chat to begin."
                  />
                )}

                {!conversationsLoading && !conversationsError && conversations.length > 0 && (
                  <div className="space-y-0.5 p-2">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          activeConversationId === conv.id
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{conv.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          className="shrink-0 rounded p-1 text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {showMobileList && (
              <div
                className="fixed inset-0 z-10 bg-black/30 md:hidden"
                onClick={() => setShowMobileList(false)}
              />
            )}

            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-indigo-600" />
                    <h1 className="text-base font-semibold text-slate-900">AI Assistant</h1>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  disabled={messages.length === 0}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Clear Chat
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                {chatError && (
                  <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {chatError}
                  </div>
                )}

                {messages.length === 0 && !isSending && (
                  <div className="flex h-full items-center justify-center">
                    <EmptyState
                      icon={Bot}
                      title="AI Prompt Assistant"
                      description="Ask me anything about prompt engineering!"
                    />
                  </div>
                )}

                {messages.length > 0 && (
                  <div className="mx-auto max-w-3xl space-y-4">
                    {messages.map((msg) => (
                      <ChatBubble key={msg.id} message={msg} />
                    ))}
                    {showTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {messages.length === 0 && !isSending && suggestedFollowUps.length > 0 && (
                  <div className="mx-auto mt-6 max-w-3xl">
                    <p className="mb-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Suggested questions
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedFollowUps.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSelectFollowUp(q)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isSending && messages.length > 0 && suggestedFollowUps.length > 0 && (
                  <div className="mx-auto mt-4 max-w-3xl">
                    <p className="mb-2 text-center text-xs font-medium text-slate-400">
                      Follow up
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedFollowUps.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSelectFollowUp(q)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 bg-white px-4 py-4">
                <div className="mx-auto max-w-3xl">
                  <ChatInput onSend={handleSend} disabled={isSending} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

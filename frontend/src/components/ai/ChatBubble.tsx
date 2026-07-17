'use client';

import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '@/types/ai.types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-indigo-100' : 'bg-slate-200'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-indigo-600" />
        ) : (
          <Bot className="h-4 w-4 text-slate-600" />
        )}
      </div>
      <div className={`flex max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
              : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 text-[10px] text-slate-400">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

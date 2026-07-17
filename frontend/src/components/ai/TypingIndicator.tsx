'use client';

import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
        <Bot className="h-4 w-4 text-slate-600" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
        <div className="flex items-center gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '300ms' }}
          />
          <span className="ml-2 text-xs text-slate-500">Thinking...</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface OptimizedPromptProps {
  prompt: string;
  explanation?: string;
  changesMade?: string[];
  onCopy: () => void;
}

export function OptimizedPrompt({ prompt, explanation, changesMade, onCopy }: OptimizedPromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Sparkles className="h-5 w-5 text-primary-500" />
          Optimized Prompt
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          isLoading={copied}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono leading-relaxed">
          {prompt}
        </pre>
      </div>

      {explanation && (
        <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-700">
            <Sparkles className="h-4 w-4" />
            What changed
          </h4>
          <p className="text-sm text-primary-800 leading-relaxed">{explanation}</p>
        </div>
      )}

      {changesMade && changesMade.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Changes Made</h4>
          <ul className="space-y-1.5">
            {changesMade.map((change, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary-500" />
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface VariantCardProps {
  variant: { type: string; content: string };
  onCopy: (content: string) => void;
}

export function VariantCard({ variant, onCopy }: VariantCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(variant.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="default">{variant.type}</Badge>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400" />
          )}
        </Button>
      </div>
      <div className="max-h-32 overflow-hidden">
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
          {variant.content}
        </p>
      </div>
      {variant.content.length > 200 && (
        <button
          onClick={() => navigator.clipboard?.writeText(variant.content)}
          className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          View full prompt
        </button>
      )}
    </div>
  );
}

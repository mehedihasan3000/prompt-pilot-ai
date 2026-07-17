'use client';

import { FileText, Star, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Template } from '@/types/template.types';

interface TemplateCardProps {
  template: Template;
  onView: (id: string) => void;
}

const difficultyColor = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

export function TemplateCard({ template, onView }: TemplateCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
          <FileText className="h-6 w-6 text-primary-600" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="default">{template.category}</Badge>
        </div>
      </div>
      <div className="flex-1 px-5 pb-3">
        <h3 className="mb-1.5 text-base font-semibold text-slate-900 line-clamp-1">{template.title}</h3>
        <p className="mb-3 text-sm text-slate-500 line-clamp-2">{template.shortDescription}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {template.targetModel && (
            <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700')}>
              {template.targetModel}
            </span>
          )}
          {template.difficulty && (
            <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', difficultyColor[template.difficulty as keyof typeof difficultyColor] || 'bg-slate-100 text-slate-700')}>
              {template.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {template.averageRating.toFixed(1)}
          </span>
          <span>{template.usageCount} uses</span>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onView(template.id)}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}
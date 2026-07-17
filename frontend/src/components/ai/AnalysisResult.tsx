'use client';

import { CheckCircle2, AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from './ScoreRing';

interface AnalysisResultProps {
  result: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    missingContext: string[];
    analysis: string;
  };
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative flex items-center justify-center">
          <ScoreRing score={result.score} size="lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">Analysis Summary</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{result.analysis}</p>
        </div>
      </div>

      {result.strengths.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.strengths.map((strength, i) => (
              <Badge key={i} variant="success">{strength}</Badge>
            ))}
          </div>
        </div>
      )}

      {result.weaknesses.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Weaknesses
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.weaknesses.map((weakness, i) => (
              <Badge key={i} variant="warning">{weakness}</Badge>
            ))}
          </div>
        </div>
      )}

      {result.missingContext.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HelpCircle className="h-4 w-4" />
            Missing Context
          </h4>
          <ul className="space-y-1.5">
            {result.missingContext.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

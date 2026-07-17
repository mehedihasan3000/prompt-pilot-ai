'use client';

import { MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface FollowUpQuestionsProps {
  questions: string[];
  onAnswer: (question: string, answer: string) => void;
  answeredQuestions: Map<string, string>;
}

export function FollowUpQuestions({ questions, onAnswer, answeredQuestions }: FollowUpQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <MessageSquare className="h-5 w-5 text-primary-500" />
        Follow-up Questions
      </h3>
      <p className="text-sm text-slate-500">
        Answer these questions to help the AI better understand your prompt.
      </p>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <p className="mb-2 text-sm font-medium text-slate-800">{question}</p>
            <Input
              placeholder="Type your answer..."
              value={answeredQuestions.get(question) || ''}
              onChange={(e) => onAnswer(question, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

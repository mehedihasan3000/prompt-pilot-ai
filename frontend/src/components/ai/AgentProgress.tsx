'use client';

import { Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AgentProgressProps {
  currentStep: number;
  steps: string[];
  status: 'idle' | 'running' | 'completed' | 'error';
}

export function AgentProgress({ currentStep, steps, status }: AgentProgressProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step} className="flex items-start gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted && 'border-green-500 bg-green-500 text-white',
                    isCurrent && 'border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-200',
                    isPending && 'border-slate-300 bg-white text-slate-400'
                  )}
                >
                  {isCompleted && <Check className="h-4 w-4" />}
                  {isCurrent && status === 'running' && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isCurrent && status === 'error' && (
                    <span className="text-xs font-bold">!</span>
                  )}
                  {isPending && <span className="text-xs font-medium">{index + 1}</span>}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'mt-1 h-full w-0.5',
                      isCompleted ? 'bg-green-300' : 'bg-slate-200'
                    )}
                    style={{ minHeight: '24px' }}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={clsx(
                    'text-sm font-medium transition-colors',
                    isCompleted && 'text-green-600',
                    isCurrent && 'text-primary-700',
                    isPending && 'text-slate-400'
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

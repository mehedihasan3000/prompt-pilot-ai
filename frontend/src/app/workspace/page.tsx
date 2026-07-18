'use client';

import { useState, useCallback, useRef } from 'react';
import {
  PenSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  Tag,
  Star,
  Lightbulb,
  Copy,
} from 'lucide-react';
import { WorkspaceForm } from '@/components/ai/WorkspaceForm';
import { AgentProgress } from '@/components/ai/AgentProgress';
import { AnalysisResult } from '@/components/ai/AnalysisResult';
import { OptimizedPrompt } from '@/components/ai/OptimizedPrompt';
import { VariantCard } from '@/components/ai/VariantCard';
import { ScoreRing } from '@/components/ai/ScoreRing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { toast } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiFetch } from '@/lib/api';
import { analyzePrompt } from '@/services/api/ai';
import type { AnalyzeInput } from '@/services/api/ai';
import type { OrchestratorResult } from '@/types/ai.types';

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Icon className="h-5 w-5 text-primary-500" />
          {title}
        </h3>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
    </div>
  );
}

function ScoreBreakdownChart({ scores }: {
  scores: { label: string; value: number; max: number }[];
}) {
  return (
    <div className="space-y-3">
      {scores.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.value}/{item.max}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkspacePage() {
  const [step, setStep] = useState<number>(-1);
  const [result, setResult] = useState<OrchestratorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [answeredQuestions] = useState<Map<string, string>>(new Map());

  const inputRef = useRef<AnalyzeInput | null>(null);
  const steps = [
    'Planner', 'Analyzer', 'Context Checker', 'Weakness Detector',
    'Follow-up Questions', 'Optimizer', 'Variant Generator',
    'Quality Evaluator', 'Recommender', 'Auto Tagger',
  ];

  const handleSubmit = useCallback(async (data: AnalyzeInput) => {
    inputRef.current = data;
    setIsLoading(true);
    setStatus('running');
    setStep(0);
    setError(null);
    setResult(null);

    try {
      const response = await analyzePrompt(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to analyze prompt');
      }
      setResult(response.data as unknown as OrchestratorResult);
      setStatus('completed');
      setStep(steps.length);
      toast('Prompt analysis completed successfully!', 'success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to analyze prompt. Please try again.');
      toast('Failed to analyze prompt', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setStep(-1);
    setResult(null);
    setIsLoading(false);
    setStatus('idle');
    setError(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast('Copied to clipboard', 'success');
  };

  const handleSave = async () => {
    if (!result || !inputRef.current) return;
    try {
      const data = inputRef.current;
      const res = await apiFetch('/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Saved from Workspace',
          originalPrompt: data.originalPrompt,
          goal: data.goal,
          targetModel: data.targetModel,
          tone: data.tone,
          language: data.language,
          outputLength: data.outputLength,
          outputFormat: data.outputFormat,
          category: data.category || 'General',
        }),
      });
      if (res.success) {
        toast('Saved successfully!', 'success');
      } else {
        toast('Failed to save', 'error');
      }
    } catch {
      toast('Failed to save', 'error');
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Prompt Workspace</h1>
              <p className="mt-1 text-sm text-slate-500">
                Analyze, optimize, and perfect your AI prompts with our intelligent agent pipeline.
              </p>
            </div>

            {step === -1 && !isLoading && (
              <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <WorkspaceForm onSubmit={handleSubmit} isLoading={isLoading} />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Agent Pipeline</h3>
                    <AgentProgress currentStep={0} steps={steps} status="idle" />
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
                      Running Analysis
                    </h2>
                    <div className="flex items-center gap-3 rounded-lg bg-primary-50 p-4 text-sm text-primary-700">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      AI agents are analyzing your prompt...
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Agent Pipeline</h3>
                    <AgentProgress currentStep={step} steps={steps} status={status} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8">
                <ErrorState
                  title="Analysis Failed"
                  message={error}
                  onRetry={handleReset}
                />
              </div>
            )}

            {result && status === 'completed' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                      New Analysis
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4" />
                      Save Results
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                  <div className="space-y-6 lg:col-span-3">
                    <CollapsibleSection title="Analysis" icon={CheckCircle2}>
                      <AnalysisResult result={result.analysis} />
                    </CollapsibleSection>

                    {result.followUpQuestions.length > 0 && (
                      <CollapsibleSection title="Follow-up Questions" icon={Sparkles}>
                        <div className="space-y-3">
                          {result.followUpQuestions.map((q, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                                {i + 1}
                              </span>
                              <p className="text-sm text-slate-700">{typeof q === 'string' ? q : JSON.stringify(q)}</p>
                            </div>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}

                    <CollapsibleSection title="Optimized Prompt" icon={PenSquare}>
                      <OptimizedPrompt
                        prompt={result.optimizedPrompt}
                        explanation={result.explanation}
                        changesMade={result.changesMade}
                        onCopy={() => handleCopy(result.optimizedPrompt)}
                      />
                    </CollapsibleSection>

                    {result.variants.length > 0 && (
                      <CollapsibleSection title={`Variants (${result.variants.length})`} icon={Sparkles}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {result.variants.map((variant, i) => (
                            <VariantCard
                              key={i}
                              variant={variant}
                              onCopy={handleCopy}
                            />
                          ))}
                        </div>
                      </CollapsibleSection>
                    )}

                    <CollapsibleSection title="Recommendations" icon={Lightbulb}>
                      <div className="space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-primary-200"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-900">{rec.title}</span>
                              <Badge
                                variant={
                                  rec.priority === 'high'
                                    ? 'danger'
                                    : rec.priority === 'medium'
                                    ? 'warning'
                                    : 'default'
                                }
                              >
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Auto Tags" icon={Tag}>
                      <div className="flex flex-wrap gap-2">
                        {result.autoTags.tags.map((tag, i) => (
                          <Badge key={i} variant="default">{typeof tag === 'string' ? tag : JSON.stringify(tag)}</Badge>
                        ))}
                        <Badge variant="success">{result.autoTags.category}</Badge>
                      </div>
                    </CollapsibleSection>
                  </div>

                  <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <div className="mb-4 flex items-center justify-center">
                        <ScoreRing score={result.scoreResult.totalScore} size="lg" />
                      </div>
                      <div className="text-center">
                        <span className="text-lg font-bold text-slate-900">{result.scoreResult.grade}</span>
                        <p className="mt-1 text-xs text-slate-500">{result.scoreResult.explanation}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                        <Star className="h-5 w-5 text-amber-400" />
                        Score Breakdown
                      </h3>
                      <ScoreBreakdownChart
                        scores={[
                          { label: 'Clarity', value: result.scoreResult.clarity, max: 100 },
                          { label: 'Context', value: result.scoreResult.context, max: 100 },
                          { label: 'Specificity', value: result.scoreResult.specificity, max: 100 },
                          { label: 'Constraints', value: result.scoreResult.constraints, max: 100 },
                          { label: 'Output Format', value: result.scoreResult.outputFormat, max: 100 },
                          { label: 'Tone Alignment', value: result.scoreResult.toneAlignment, max: 100 },
                        ]}
                      />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                      <h3 className="mb-4 text-base font-semibold text-slate-900">Agent Pipeline</h3>
                      <AgentProgress currentStep={steps.length} steps={steps} status="completed" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}

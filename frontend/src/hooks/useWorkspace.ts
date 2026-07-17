'use client';

import { useState, useCallback } from 'react';
import type { CreatePromptPayload, ScoreBreakdown } from '@/types/prompt.types';
import type { AnalysisResult, OptimizedResult, Recommendation } from '@/types/ai.types';

interface WorkspaceState {
  title: string;
  content: string;
  goal: string;
  model: string;
  tags: string[];
  collectionId: string;
}

interface WorkspaceReturn {
  state: WorkspaceState;
  analysis: AnalysisResult | null;
  optimizedResults: OptimizedResult[];
  recommendations: Recommendation[];
  isAnalyzing: boolean;
  isOptimizing: boolean;
  setField: <K extends keyof WorkspaceState>(field: K, value: WorkspaceState[K]) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  setOptimizedResults: (results: OptimizedResult[]) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setIsAnalyzing: (val: boolean) => void;
  setIsOptimizing: (val: boolean) => void;
  reset: () => void;
  getCreatePayload: () => CreatePromptPayload;
}

const initialState: WorkspaceState = {
  title: '',
  content: '',
  goal: '',
  model: '',
  tags: [],
  collectionId: '',
};

export function useWorkspace(): WorkspaceReturn {
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [optimizedResults, setOptimizedResults] = useState<OptimizedResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const setField = useCallback(
    <K extends keyof WorkspaceState>(field: K, value: WorkspaceState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setState(initialState);
    setAnalysis(null);
    setOptimizedResults([]);
    setRecommendations([]);
    setIsAnalyzing(false);
    setIsOptimizing(false);
  }, []);

  const getCreatePayload = useCallback((): CreatePromptPayload => {
    return {
      title: state.title,
      content: state.content,
      goal: state.goal || undefined,
      model: state.model || undefined,
      tags: state.tags.length > 0 ? state.tags : undefined,
      collectionId: state.collectionId || undefined,
    };
  }, [state]);

  return {
    state,
    analysis,
    optimizedResults,
    recommendations,
    isAnalyzing,
    isOptimizing,
    setField,
    setAnalysis,
    setOptimizedResults,
    setRecommendations,
    setIsAnalyzing,
    setIsOptimizing,
    reset,
    getCreatePayload,
  };
}

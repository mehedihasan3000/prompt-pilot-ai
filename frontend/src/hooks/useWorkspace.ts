'use client';

import { useState, useCallback } from 'react';
import type { CreatePromptPayload, ScoreBreakdown } from '@/types/prompt.types';

interface WorkspaceState {
  title: string;
  content: string;
  goal: string;
  model: string;
  tags: string[];
  collectionId: string;
}

interface WorkspaceAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingContext: string[];
  analysis: string;
}

interface WorkspaceOptimized {
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
}

interface WorkspaceRecommendation {
  title: string;
  description: string;
  priority: string;
}

interface WorkspaceReturn {
  state: WorkspaceState;
  analysis: WorkspaceAnalysis | null;
  optimizedResults: WorkspaceOptimized[];
  recommendations: WorkspaceRecommendation[];
  isAnalyzing: boolean;
  isOptimizing: boolean;
  setField: <K extends keyof WorkspaceState>(field: K, value: WorkspaceState[K]) => void;
  setAnalysis: (analysis: WorkspaceAnalysis | null) => void;
  setOptimizedResults: (results: WorkspaceOptimized[]) => void;
  setRecommendations: (recs: WorkspaceRecommendation[]) => void;
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
  const [analysis, setAnalysis] = useState<WorkspaceAnalysis | null>(null);
  const [optimizedResults, setOptimizedResults] = useState<WorkspaceOptimized[]>([]);
  const [recommendations, setRecommendations] = useState<WorkspaceRecommendation[]>([]);
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
      originalPrompt: state.content,
      goal: state.goal || undefined,
      targetModel: state.model || undefined,
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

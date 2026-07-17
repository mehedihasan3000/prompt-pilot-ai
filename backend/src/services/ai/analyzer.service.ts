import { callAi } from './ai.utils';
import { getAnalyzerSystemPrompt } from '../../prompts/analyzer.prompt';

export interface AnalyzerInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
  audience?: string;
  extraContext?: string;
  constraints?: string;
}

export interface AnalyzerResult {
  score: number;
  clarity: number;
  context: number;
  specificity: number;
  constraints: number;
  outputFormat: number;
  toneAlignment: number;
  strengths: string[];
  weaknesses: string[];
  missingContext: string[];
  analysis: string;
}

const FALLBACK: AnalyzerResult = {
  score: 50,
  clarity: 50,
  context: 50,
  specificity: 50,
  constraints: 50,
  outputFormat: 50,
  toneAlignment: 50,
  strengths: ['Prompt has a clear goal'],
  weaknesses: ['Could benefit from more specific details'],
  missingContext: [],
  analysis: 'Basic analysis completed. Consider providing more context for a thorough evaluation.',
};

export async function analyze(input: AnalyzerInput): Promise<AnalyzerResult> {
  try {
    const systemPrompt = getAnalyzerSystemPrompt(input);
    const prompt = `Analyze the following prompt thoroughly and return a complete JSON evaluation:

Original prompt: "${input.originalPrompt}"
Goal: "${input.goal}"
Target model: "${input.targetModel}"

Evaluate each criterion on a scale of 0-100 and provide specific strengths, weaknesses, and missing context.`;

    const result = await callAi<AnalyzerResult>({ prompt, systemPrompt, temperature: 0.3 });
    return {
      score: Math.min(100, Math.max(0, result.score ?? 50)),
      clarity: Math.min(100, Math.max(0, result.clarity ?? 50)),
      context: Math.min(100, Math.max(0, result.context ?? 50)),
      specificity: Math.min(100, Math.max(0, result.specificity ?? 50)),
      constraints: Math.min(100, Math.max(0, result.constraints ?? 50)),
      outputFormat: Math.min(100, Math.max(0, result.outputFormat ?? 50)),
      toneAlignment: Math.min(100, Math.max(0, result.toneAlignment ?? 50)),
      strengths: Array.isArray(result.strengths) ? result.strengths : FALLBACK.strengths,
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : FALLBACK.weaknesses,
      missingContext: Array.isArray(result.missingContext) ? result.missingContext : [],
      analysis: result.analysis || FALLBACK.analysis,
    };
  } catch {
    return FALLBACK;
  }
}

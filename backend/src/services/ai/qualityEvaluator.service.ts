import { callAi } from './ai.utils';

export interface QualityEvaluatorInput {
  originalPrompt: string;
  optimizedPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
}

export interface QualityEvaluatorResult {
  totalScore: number;
  clarity: number;
  context: number;
  specificity: number;
  constraints: number;
  outputFormat: number;
  toneAlignment: number;
  grade: 'Poor' | 'Average' | 'Good' | 'Excellent';
  explanation: string;
}

function calculateGrade(score: number): 'Poor' | 'Average' | 'Good' | 'Excellent' {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Poor';
}

const FALLBACK: QualityEvaluatorResult = {
  totalScore: 50,
  clarity: 50,
  context: 50,
  specificity: 50,
  constraints: 50,
  outputFormat: 50,
  toneAlignment: 50,
  grade: 'Average',
  explanation: 'Quality evaluation unavailable.',
};

export async function evaluateQuality(input: QualityEvaluatorInput): Promise<QualityEvaluatorResult> {
  try {
    const systemPrompt = 'You are a prompt quality evaluator. Score prompts on multiple criteria. Return ONLY valid JSON.';
    const prompt = `Evaluate the quality of the optimized prompt compared to the original:

Original prompt: "${input.originalPrompt}"
Optimized prompt: "${input.optimizedPrompt}"
Goal: "${input.goal}"
Target model: "${input.targetModel}"
${input.tone ? `Desired tone: "${input.tone}"` : ''}

Score each criterion 0-100 and provide a total score. Weights: Clarity=20%, Context=20%, Specificity=20%, Constraints=15%, OutputFormat=15%, ToneAlignment=10%.

Return a JSON object exactly:
{
  "totalScore": <number 0-100>,
  "clarity": <number 0-100>,
  "context": <number 0-100>,
  "specificity": <number 0-100>,
  "constraints": <number 0-100>,
  "outputFormat": <number 0-100>,
  "toneAlignment": <number 0-100>,
  "explanation": <string>
}`;

    const result = await callAi<QualityEvaluatorResult>({ prompt, systemPrompt, temperature: 0.3 });
    const totalScore = Math.min(100, Math.max(0, result.totalScore ?? 50));
    return {
      totalScore,
      clarity: Math.min(100, Math.max(0, result.clarity ?? 50)),
      context: Math.min(100, Math.max(0, result.context ?? 50)),
      specificity: Math.min(100, Math.max(0, result.specificity ?? 50)),
      constraints: Math.min(100, Math.max(0, result.constraints ?? 50)),
      outputFormat: Math.min(100, Math.max(0, result.outputFormat ?? 50)),
      toneAlignment: Math.min(100, Math.max(0, result.toneAlignment ?? 50)),
      grade: calculateGrade(totalScore),
      explanation: result.explanation || FALLBACK.explanation,
    };
  } catch {
    return FALLBACK;
  }
}

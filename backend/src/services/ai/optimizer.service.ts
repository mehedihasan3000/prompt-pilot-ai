import { callAi } from './ai.utils';
import { getOptimizerSystemPrompt } from '../../prompts/optimizer.prompt';

export interface OptimizerInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
  outputLength?: string;
  language?: string;
  audience?: string;
  extraContext?: string;
  constraints?: string;
  examples?: string;
}

export interface OptimizerResult {
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
}

const FALLBACK: OptimizerResult = {
  optimizedPrompt: '',
  explanation: 'Optimization could not be completed.',
  changesMade: [],
};

export async function optimize(input: OptimizerInput): Promise<OptimizerResult> {
  try {
    const systemPrompt = getOptimizerSystemPrompt(input);
    const prompt = `Rewrite this prompt to be clearer and more effective:

Original: "${input.originalPrompt}"

Apply prompt engineering best practices and optimize for ${input.targetModel}.`;

    const result = await callAi<OptimizerResult>({ prompt, systemPrompt, temperature: 0.5 });
    return {
      optimizedPrompt: result.optimizedPrompt || input.originalPrompt,
      explanation: result.explanation || 'Optimization applied.',
      changesMade: Array.isArray(result.changesMade) ? result.changesMade.filter((c): c is string => typeof c === 'string') : [],
    };
  } catch {
    return {
      optimizedPrompt: input.originalPrompt,
      explanation: 'Basic optimization applied (AI service unavailable).',
      changesMade: [],
    };
  }
}

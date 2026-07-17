import { callAi } from './ai.utils';
import { getRecommenderSystemPrompt } from '../../prompts/recommender.prompt';

export interface RecommenderInput {
  originalPrompt: string;
  optimizedPrompt: string;
  score: number;
  scoreBreakdown: {
    clarity: number;
    context: number;
    specificity: number;
    constraints: number;
    outputFormat: number;
    toneAlignment: number;
  };
  strengths: string[];
  weaknesses: string[];
}

export interface RecommenderResult {
  recommendations: { title: string; description: string; priority: 'low' | 'medium' | 'high' }[];
}

const FALLBACK: RecommenderResult = {
  recommendations: [
    { title: 'Review the basics', description: 'Ensure your prompt includes clear instructions and context.', priority: 'medium' },
  ],
};

export async function recommend(input: RecommenderInput): Promise<RecommenderResult> {
  try {
    const systemPrompt = getRecommenderSystemPrompt(input);
    const prompt = `Based on the analysis, provide actionable recommendations to improve this prompt. Score: ${input.score}/100. Weakest areas: ${Object.entries(input.scoreBreakdown).filter(([, v]) => v < 60).map(([k]) => k).join(', ')}`;

    const result = await callAi<RecommenderResult>({ prompt, systemPrompt, temperature: 0.4 });
    if (Array.isArray(result.recommendations) && result.recommendations.length > 0) {
      return {
        recommendations: result.recommendations.map(r => ({
          title: r.title || 'Improvement suggestion',
          description: r.description || '',
          priority: ['low', 'medium', 'high'].includes(r.priority) ? r.priority : 'medium',
        })),
      };
    }
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

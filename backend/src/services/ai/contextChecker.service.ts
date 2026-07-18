import { callAi } from './ai.utils';

export interface ContextCheckerInput {
  originalPrompt: string;
  goal: string;
  audience?: string;
  extraContext?: string;
}

export interface ContextCheckerResult {
  missingContextPoints: string[];
  requiredFollowUps: string[];
  optionalQuestions: string[];
}

const FALLBACK: ContextCheckerResult = {
  missingContextPoints: [],
  requiredFollowUps: ['What specific outcome are you looking for?'],
  optionalQuestions: ['Would you like to add more context?'],
};

export async function checkContext(input: ContextCheckerInput): Promise<ContextCheckerResult> {
  try {
    const systemPrompt = 'You are a context analysis expert. Identify missing context in prompts. Return ONLY valid JSON.';
    const prompt = `Analyze this prompt for missing context:
- Prompt: "${input.originalPrompt}"
- Goal: "${input.goal}"
${input.audience ? `- Audience: "${input.audience}"` : ''}
${input.extraContext ? `- Extra context provided: "${input.extraContext}"` : ''}

Return a JSON object exactly:
{
  "missingContextPoints": [<string - specific missing context elements>],
  "requiredFollowUps": [<string - questions essential to ask before optimizing>],
  "optionalQuestions": [<string - nice-to-have clarifying questions>]
}`;

    const result = await callAi<ContextCheckerResult>({ prompt, systemPrompt, temperature: 0.3 });
    return {
      missingContextPoints: Array.isArray(result.missingContextPoints) ? result.missingContextPoints.filter((m): m is string => typeof m === 'string') : FALLBACK.missingContextPoints,
      requiredFollowUps: Array.isArray(result.requiredFollowUps) ? result.requiredFollowUps.filter((r): r is string => typeof r === 'string') : FALLBACK.requiredFollowUps,
      optionalQuestions: Array.isArray(result.optionalQuestions) ? result.optionalQuestions.filter((o): o is string => typeof o === 'string') : FALLBACK.optionalQuestions,
    };
  } catch {
    return FALLBACK;
  }
}

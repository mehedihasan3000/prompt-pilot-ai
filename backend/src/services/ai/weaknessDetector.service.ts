import { callAi } from './ai.utils';

export interface WeaknessDetectorInput {
  originalPrompt: string;
  goal: string;
  constraints?: string;
  tone?: string;
  audience?: string;
}

export interface WeaknessDetectorResult {
  weaknesses: string[];
  severity: 'low' | 'medium' | 'high';
  ambiguityFound: boolean;
  vagueInstructions: string[];
  missingConstraints: string[];
}

const FALLBACK: WeaknessDetectorResult = {
  weaknesses: [],
  severity: 'low',
  ambiguityFound: false,
  vagueInstructions: [],
  missingConstraints: [],
};

export async function detectWeaknesses(input: WeaknessDetectorInput): Promise<WeaknessDetectorResult> {
  try {
    const systemPrompt = 'You are a prompt weakness detection expert. Identify structural and content weaknesses. Return ONLY valid JSON.';
    const prompt = `Detect weaknesses in this prompt:
- Prompt: "${input.originalPrompt}"
- Goal: "${input.goal}"
${input.constraints ? `- Constraints: "${input.constraints}"` : ''}
${input.tone ? `- Desired tone: "${input.tone}"` : ''}
${input.audience ? `- Audience: "${input.audience}"` : ''}

Return a JSON object exactly:
{
  "weaknesses": [<string - description of each weakness>],
  "severity": "low" | "medium" | "high",
  "ambiguityFound": <boolean>,
  "vagueInstructions": [<string - specific vague phrases found>],
  "missingConstraints": [<string - constraints that should be added>]
}`;

    const result = await callAi<WeaknessDetectorResult>({ prompt, systemPrompt, temperature: 0.3 });
    return {
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      severity: ['low', 'medium', 'high'].includes(result.severity) ? result.severity : 'low',
      ambiguityFound: result.ambiguityFound ?? false,
      vagueInstructions: Array.isArray(result.vagueInstructions) ? result.vagueInstructions : [],
      missingConstraints: Array.isArray(result.missingConstraints) ? result.missingConstraints : [],
    };
  } catch {
    return FALLBACK;
  }
}

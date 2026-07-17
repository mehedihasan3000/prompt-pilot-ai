import { callAi } from './ai.utils';

export interface PlannerInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone: string;
  language: string;
  outputLength: string;
  outputFormat: string;
  audience?: string;
  category?: string;
  extraContext?: string;
  constraints?: string;
  examples?: string;
}

export interface PlannerResult {
  intent: string;
  taskType: string;
  requiredContext: string[];
  optimizationPath: string;
}

const FALLBACK: PlannerResult = {
  intent: 'General prompt optimization',
  taskType: 'standard',
  requiredContext: [],
  optimizationPath: 'analyze-then-optimize',
};

export async function plan(input: PlannerInput): Promise<PlannerResult> {
  try {
    const prompt = `Analyze this prompt optimization request:
- Original prompt: "${input.originalPrompt}"
- Goal: "${input.goal}"
- Target model: "${input.targetModel}"
- Tone: "${input.tone}"
- Language: "${input.language}"
- Output length: "${input.outputLength}"
- Output format: "${input.outputFormat}"
${input.audience ? `- Audience: "${input.audience}"` : ''}
${input.category ? `- Category: "${input.category}"` : ''}
${input.extraContext ? `- Extra context: "${input.extraContext}"` : ''}
${input.constraints ? `- Constraints: "${input.constraints}"` : ''}

Return a JSON object:
{
  "intent": <string - one sentence describing the user's core intent>,
  "taskType": <"standard" | "creative" | "technical" | "instructional">,
  "requiredContext": [<string - what context is needed for optimization>],
  "optimizationPath": <string - suggested optimization approach>
}`;

    const systemPrompt = 'You are a prompt engineering planner. Analyze the request and plan the optimization approach. Return ONLY valid JSON.';

    return await callAi<PlannerResult>({ prompt, systemPrompt, temperature: 0.3 });
  } catch {
    return FALLBACK;
  }
}

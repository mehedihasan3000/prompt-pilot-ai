import { callAi } from './ai.utils';

export interface FollowUpInput {
  originalPrompt: string;
  goal: string;
  missingContext: string[];
  weaknesses: string[];
}

export interface FollowUpResult {
  questions: string[];
}

const FALLBACK: FollowUpResult = {
  questions: [
    'What specific outcome do you want from this prompt?',
    'Who is the target audience for the output?',
    'What tone or style should the response use?',
  ],
};

export async function generateFollowUps(input: FollowUpInput): Promise<FollowUpResult> {
  try {
    const systemPrompt = 'You are an expert at asking clarifying questions to improve prompts. Return ONLY valid JSON.';
    const prompt = `Based on this prompt analysis, generate smart follow-up questions:

Original prompt: "${input.originalPrompt}"
Goal: "${input.goal}"
Missing context: ${input.missingContext.join(', ')}
Identified weaknesses: ${input.weaknesses.join(', ')}

Return a JSON object exactly:
{
  "questions": [<string - 3-5 concise clarifying questions>]
}`;

    const result = await callAi<FollowUpResult>({ prompt, systemPrompt, temperature: 0.4 });
    return {
      questions: Array.isArray(result.questions) ? result.questions : FALLBACK.questions,
    };
  } catch {
    return FALLBACK;
  }
}

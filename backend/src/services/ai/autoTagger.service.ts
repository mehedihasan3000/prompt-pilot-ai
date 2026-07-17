import { callAi } from './ai.utils';

export interface AutoTaggerInput {
  originalPrompt: string;
  goal: string;
  category?: string;
  outputFormat?: string;
  targetModel?: string;
}

export interface AutoTaggerResult {
  tags: string[];
  category: string;
}

const ALL_TAGS = [
  'Coding', 'Marketing', 'Academic', 'Research', 'Email',
  'Blog', 'Business', 'Social Media', 'Data Analysis', 'Image Generation',
];

const FALLBACK: AutoTaggerResult = {
  tags: ['General'],
  category: 'General',
};

export async function autoTag(input: AutoTaggerInput): Promise<AutoTaggerResult> {
  try {
    const systemPrompt = 'You are a prompt classifier. Categorize prompts and assign relevant tags. Return ONLY valid JSON.';
    const prompt = `Classify this prompt:
- Prompt: "${input.originalPrompt}"
- Goal: "${input.goal}"
${input.category ? `- Suggested category: "${input.category}"` : ''}
${input.outputFormat ? `- Output format: "${input.outputFormat}"` : ''}
${input.targetModel ? `- Target model: "${input.targetModel}"` : ''}

Available tags: ${ALL_TAGS.join(', ')}

Return a JSON object exactly:
{
  "tags": [<string - 1-3 most relevant tags from the list>],
  "category": <string - best matching single category>
}

Pick tags only from the available list. Choose the closest match for category.`;

    const result = await callAi<AutoTaggerResult>({ prompt, systemPrompt, temperature: 0.2 });
    return {
      tags: Array.isArray(result.tags) ? result.tags.filter(t => ALL_TAGS.includes(t)) : FALLBACK.tags,
      category: result.category || FALLBACK.category,
    };
  } catch {
    return FALLBACK;
  }
}

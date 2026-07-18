import { callAi } from './ai.utils';
import { getVariantsSystemPrompt } from '../../prompts/variants.prompt';

export interface VariantGeneratorInput {
  originalPrompt: string;
  optimizedPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
}

export interface VariantGeneratorResult {
  variants: { type: string; content: string }[];
}

const VARIANT_TYPES = [
  'Beginner Friendly',
  'Professional',
  'Short',
  'Detailed',
  'Claude-optimized',
  'Gemini-optimized',
  'ChatGPT-optimized',
  'Few-shot',
  'Structured JSON',
];

const FALLBACK: VariantGeneratorResult = {
  variants: VARIANT_TYPES.map(type => ({
    type,
    content: '',
  })),
};

export async function generateVariants(input: VariantGeneratorInput): Promise<VariantGeneratorResult> {
  try {
    const systemPrompt = getVariantsSystemPrompt(input);
    const prompt = `Generate all 9 prompt variants for this optimized prompt: "${input.optimizedPrompt}". Return the complete JSON object with all variants.`;

    const result = await callAi<VariantGeneratorResult>({ prompt, systemPrompt, temperature: 0.6 });
    if (Array.isArray(result.variants) && result.variants.length > 0) {
      return {
        variants: result.variants.map(v => ({
          type: typeof v.type === 'string' ? v.type : 'Variant',
          content: typeof v.content === 'string' ? v.content : '',
        })),
      };
    }
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

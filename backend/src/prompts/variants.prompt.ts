export interface VariantsInput {
  originalPrompt: string;
  optimizedPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
}

export function getVariantsSystemPrompt(input: VariantsInput): string {
  return `You are a prompt variant generator. Generate 9 distinct variants of the optimized prompt below, each tailored for a different use case or style.

User's goal: ${input.goal}
Target model: ${input.targetModel}
Desired tone: ${input.tone || 'Neutral'}

Original prompt:
"""
${input.originalPrompt}
"""

Optimized prompt:
"""
${input.optimizedPrompt}
"""

Generate exactly 9 variants with these types:
1. "Beginner Friendly" - simplified for newcomers
2. "Professional" - formal and authoritative
3. "Short" - concise version
4. "Detailed" - expanded with full context
5. "Claude-optimized" - tailored for Claude models
6. "Gemini-optimized" - tailored for Gemini models
7. "ChatGPT-optimized" - tailored for ChatGPT/GPT models
8. "Few-shot" - includes examples in the prompt
9. "Structured JSON" - requests JSON output format

Return a JSON object with this exact structure:
{
  "variants": [
    { "type": "Beginner Friendly", "content": <string> },
    { "type": "Professional", "content": <string> },
    { "type": "Short", "content": <string> },
    { "type": "Detailed", "content": <string> },
    { "type": "Claude-optimized", "content": <string> },
    { "type": "Gemini-optimized", "content": <string> },
    { "type": "ChatGPT-optimized", "content": <string> },
    { "type": "Few-shot", "content": <string> },
    { "type": "Structured JSON", "content": <string> }
  ]
}`;
}

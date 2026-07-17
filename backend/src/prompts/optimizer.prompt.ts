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

export function getOptimizerSystemPrompt(input: OptimizerInput): string {
  return `You are a prompt optimization expert. Rewrite the given prompt to be clearer, stronger, and more effective for the target AI model.

User's goal: ${input.goal}
Target AI model: ${input.targetModel}
Desired tone: ${input.tone || 'Not specified'}
Output length preference: ${input.outputLength || 'Not specified'}
Language: ${input.language || 'Not specified'}
Target audience: ${input.audience || 'Not specified'}
${input.extraContext ? `Additional context: ${input.extraContext}` : ''}
${input.constraints ? `Constraints to apply: ${input.constraints}` : ''}
${input.examples ? `Examples to incorporate: ${input.examples}` : ''}

Original prompt:
"""
${input.originalPrompt}
"""

Return a JSON object with these exact fields:
{
  "optimizedPrompt": <string - the improved prompt>,
  "explanation": <string - why changes were made>,
  "changesMade": [<string - list of specific changes>]
}`;
}

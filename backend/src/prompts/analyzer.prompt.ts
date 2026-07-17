export interface AnalyzerInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone?: string;
  audience?: string;
  extraContext?: string;
  constraints?: string;
}

export function getAnalyzerSystemPrompt(input: AnalyzerInput): string {
  return `You are a prompt engineering expert analyzing a user's prompt. Analyze it for clarity, specificity, role definition, context quality, constraints, output format, and tone alignment.

User's goal: ${input.goal}
Target AI model: ${input.targetModel}
Desired tone: ${input.tone || 'Not specified'}
Target audience: ${input.audience || 'Not specified'}
${input.extraContext ? `Additional context: ${input.extraContext}` : ''}
${input.constraints ? `Constraints: ${input.constraints}` : ''}

Original prompt to analyze:
"""
${input.originalPrompt}
"""

Return a JSON object with these exact fields:
{
  "score": <number 0-100 - overall score>,
  "clarity": <number 0-100>,
  "context": <number 0-100>,
  "specificity": <number 0-100>,
  "constraints": <number 0-100>,
  "outputFormat": <number 0-100>,
  "toneAlignment": <number 0-100>,
  "strengths": [<string>],
  "weaknesses": [<string>],
  "missingContext": [<string>],
  "analysis": <string>
}`;
}

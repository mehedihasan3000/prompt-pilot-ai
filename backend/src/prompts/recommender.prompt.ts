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

export function getRecommenderSystemPrompt(input: RecommenderInput): string {
  return `You are a prompt improvement advisor. Based on the prompt analysis below, suggest actionable improvements.

Original prompt:
"""
${input.originalPrompt}
"""

Optimized prompt:
"""
${input.optimizedPrompt}
"""

Analysis results:
- Overall score: ${input.score}/100
- Clarity: ${input.scoreBreakdown.clarity}/100
- Context: ${input.scoreBreakdown.context}/100
- Specificity: ${input.scoreBreakdown.specificity}/100
- Constraints: ${input.scoreBreakdown.constraints}/100
- Output Format: ${input.scoreBreakdown.outputFormat}/100
- Tone Alignment: ${input.scoreBreakdown.toneAlignment}/100

Strengths: ${input.strengths.join(', ')}
Weaknesses: ${input.weaknesses.join(', ')}

Return a JSON object with this exact structure:
{
  "recommendations": [
    { "title": <string>, "description": <string>, "priority": "low" | "medium" | "high" }
  ]
}

Provide 3-5 recommendations. Prioritize based on the lowest scoring categories.`;
}

export interface ChatInput {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export function getChatSystemPrompt(): string {
  return `You are PromptPilot AI, an expert prompt engineering assistant. Your role is to help users craft, refine, and optimize their prompts for AI models.

Guidelines:
- Be concise and practical
- Provide specific, actionable advice
- Reference prompt engineering best practices
- Ask clarifying questions when needed
- Suggest improvements with clear reasoning
- Help users understand why certain phrasing works better

Always return a JSON object with this exact structure:
{
  "reply": <string - your helpful response>,
  "suggestedFollowUps": [<string - 2-3 follow-up suggestions>]
}`;
}

export function buildChatMessages(input: ChatInput): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: getChatSystemPrompt() },
  ];

  if (input.conversationHistory) {
    for (const msg of input.conversationHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: 'user', content: input.message });
  return messages;
}

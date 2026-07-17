import { callAi } from './ai.utils';
import { getChatSystemPrompt } from '../../prompts/chat.prompt';

export interface ChatAssistantInput {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatAssistantResult {
  reply: string;
  suggestedFollowUps: string[];
}

const FALLBACK: ChatAssistantResult = {
  reply: 'I can help you improve your prompts. Please share your prompt and what you would like to achieve.',
  suggestedFollowUps: ['How do I write better prompts?', 'What makes a prompt effective?'],
};

export async function chat(input: ChatAssistantInput): Promise<ChatAssistantResult> {
  try {
    const systemPrompt = getChatSystemPrompt();

    let conversationText = '';
    if (input.conversationHistory) {
      for (const msg of input.conversationHistory) {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationText += `${role}: ${msg.content}\n\n`;
      }
    }
    conversationText += `User: ${input.message}`;

    const completion = await callAi<ChatAssistantResult>({
      prompt: conversationText,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1024,
    });
    return {
      reply: completion.reply || FALLBACK.reply,
      suggestedFollowUps: Array.isArray(completion.suggestedFollowUps)
        ? completion.suggestedFollowUps.slice(0, 3)
        : FALLBACK.suggestedFollowUps,
    };
  } catch {
    return FALLBACK;
  }
}

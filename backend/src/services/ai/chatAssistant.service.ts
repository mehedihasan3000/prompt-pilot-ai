import { callGroq } from './ai.utils';
import { buildChatMessages } from '../../prompts/chat.prompt';

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
    const messages = buildChatMessages(input);
    const completion = await callGroq<ChatAssistantResult>({
      prompt: input.message,
      systemPrompt: messages.find(m => m.role === 'system')?.content || '',
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

import { gemini, groq } from '../../config/ai';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export interface AiCallOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

function buildGeminiContents(systemPrompt?: string, prompt?: string): string[] {
  const parts: string[] = [];
  if (systemPrompt) parts.push(systemPrompt);
  if (prompt) parts.push(prompt);
  return parts;
}

function buildGroqMessages(systemPrompt?: string, prompt?: string): ChatCompletionMessageParam[] {
  const messages: ChatCompletionMessageParam[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  if (prompt) messages.push({ role: 'user', content: prompt });
  return messages;
}

export async function callGemini<T>(options: AiCallOptions): Promise<T> {
  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const contents = buildGeminiContents(options.systemPrompt, options.prompt);
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: contents.map(text => ({ text })) }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
    },
  });
  const text = result.response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${text.slice(0, 200)}`);
  }
}

export async function callGroq<T>(options: AiCallOptions): Promise<T> {
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: buildGroqMessages(options.systemPrompt, options.prompt),
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2048,
    response_format: { type: 'json_object' },
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse Groq response as JSON: ${text.slice(0, 200)}`);
  }
}

export async function callAi<T>(options: AiCallOptions): Promise<T> {
  try {
    return await callGemini<T>(options);
  } catch (geminiError) {
    try {
      return await callGroq<T>(options);
    } catch (groqError) {
      throw new Error(`AI call failed. Gemini: ${(geminiError as Error).message}. Groq: ${(groqError as Error).message}`);
    }
  }
}

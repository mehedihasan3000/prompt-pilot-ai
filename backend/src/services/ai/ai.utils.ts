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
  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const contents = buildGeminiContents(options.systemPrompt, options.prompt);
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: contents.map(text => ({ text })) }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
      responseMimeType: 'application/json',
    },
  });
  const text = result.response.text();
  console.log(`[Gemini] Response: ${text}`);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${text.slice(0, 200)}`);
  }
}

export async function callGroq<T>(options: AiCallOptions): Promise<T> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: buildGroqMessages(options.systemPrompt, options.prompt),
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2048,
    response_format: { type: 'json_object' },
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty response');
  console.log(`[Groq] Response: ${text}`);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse Groq response as JSON: ${text.slice(0, 200)}`);
  }
}

export async function callAi<T>(options: AiCallOptions): Promise<T> {
  try {
    const result = await callGroq<T>(options);
    console.log(`[callAi] Using Groq`);
    return result;
  } catch (groqError) {
    console.log(`[callAi] Groq failed: ${(groqError as Error).message}. Falling back to Gemini.`);
    try {
      const result = await callGemini<T>(options);
      console.log(`[callAi] Using Gemini (fallback)`);
      return result;
    } catch (geminiError) {
      throw new Error(`AI call failed. Groq: ${(groqError as Error).message}. Gemini: ${(geminiError as Error).message}`);
    }
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { env } from './env';

export const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const groq = new Groq({ apiKey: env.GROQ_API_KEY });

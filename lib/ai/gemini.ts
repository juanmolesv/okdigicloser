import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateGeminiResponse(
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const context = messages
    .map(m => `${m.role === 'user' ? 'Prospecto' : 'Asesor'}: ${m.content}`)
    .join('\n');

  const res = await model.generateContent(systemPrompt + '\n\n' + context);
  return res.response.text();
}

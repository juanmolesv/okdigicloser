import OpenAI from 'openai';
import type { Message } from '@/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateGPTResponse(
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 600,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
  });

  return res.choices[0].message.content || '';
}

import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '@/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateClaudeResponse(
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  return res.content[0].type === 'text' ? res.content[0].text : '';
}

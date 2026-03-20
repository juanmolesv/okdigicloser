import { generateClaudeResponse } from './claude';
import { generateGeminiResponse } from './gemini';
import { generateGPTResponse } from './openai';
import {
  buildSystemPrompt,
  buildClaudeRole,
  buildGeminiRole,
  buildGPTSynthesizer,
} from '../prompts/system-builder';
import type { Message, DebateResult, Closer } from '@/types';

export async function runDebate(
  closerConfig: Closer,
  history: Message[],
  userMessage: string
): Promise<DebateResult> {
  const start = Date.now();
  const systemPrompt = buildSystemPrompt(closerConfig);
  const messages: Message[] = [...history, { role: 'user', content: userMessage }];

  // ROUND 1 — Claude: empathy and emotional connection
  const claudeDraft = await generateClaudeResponse(
    buildClaudeRole(systemPrompt),
    messages
  );

  // ROUND 2 — Gemini: logic and rational persuasion
  const geminiDraft = await generateGeminiResponse(
    buildGeminiRole(systemPrompt, claudeDraft),
    messages
  );

  // ROUND 3 — GPT-4o: final synthesis
  const finalResponse = await generateGPTResponse(
    buildGPTSynthesizer(systemPrompt, claudeDraft, geminiDraft),
    messages
  );

  return {
    finalResponse: finalResponse || claudeDraft,
    processingMs: Date.now() - start,
  };
}

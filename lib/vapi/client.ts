'use client';

import Vapi from '@vapi-ai/web';

let vapi: Vapi | null = null;

export function initVapi() {
  if (!vapi) vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
  return vapi;
}

export async function startCall(assistantId: string, closerContext: Record<string, string>) {
  const client = initVapi();
  await client.start(assistantId, {
    variableValues: { ...closerContext, language: 'es' },
  } as Record<string, unknown>);

  client.on('call-start', () => console.log('Llamada iniciada'));
  client.on('call-end', () => console.log('Llamada terminada'));
  client.on('error', (e) => console.error('Vapi error:', e));

  return client;
}

export async function endCall() {
  vapi?.stop();
}

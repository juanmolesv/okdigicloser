'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DebateIndicator from './DebateIndicator';
import CallButton from './CallButton';
import UnifiedBadge from './UnifiedBadge';

interface ChatInterfaceProps {
  closerId: string;
  conversationId: string;
  welcomeMessage?: string;
  vapiAssistantId?: string;
}

export default function ChatInterface({
  closerId,
  conversationId,
  welcomeMessage,
  vapiAssistantId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (welcomeMessage) {
      return [
        {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const showCallButton = userMessageCount >= 4 && !!vapiAssistantId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isDebating]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsDebating(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closerId,
          conversationId,
          history: updatedMessages,
          message: trimmed,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();

      setIsDebating(false);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.finalResponse || data.response || 'Lo siento, hubo un error.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsDebating(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsDebating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Asistente de ventas</p>
          <p className="text-xs text-green-500">En linea</p>
        </div>
      </div>

      {/* Debate indicator */}
      {isDebating && <DebateIndicator />}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && !isDebating && <TypingIndicator />}
        {isLoading && isDebating && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Call button */}
      {showCallButton && (
        <div className="flex justify-center px-4 pb-2">
          <CallButton
            assistantId={vapiAssistantId!}
            closerContext={{
              closerId,
              conversationId,
            }}
          />
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {/* Send arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Badge */}
      <UnifiedBadge />
    </div>
  );
}

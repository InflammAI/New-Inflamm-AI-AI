'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I can help answer questions about inflammation, wellness, and general health. How can I help you today?\n\n*Note: I provide general information only and am not a substitute for professional medical advice.*',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [includeVitals, setIncludeVitals] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: input,
      //     context: includeVitals ? { vitalsSummary: '...' } : undefined,
      //   }),
      // });
      // const data = await response.json();

      // Mock response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'This is a mock response. In production, this would be powered by your AI backend with proper medical safety guardrails.\n\n*Reminder: Always consult with healthcare professionals for medical advice.*',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Chat failed:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Settings bar */}
      <div className="p-4 bg-[var(--surface)] border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">AI Chat</h1>
        
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={includeVitals}
            onChange={(e) => setIncludeVitals(e.target.checked)}
            className="w-4 h-4 rounded accent-orange-500"
          />
          Include vitals context
        </label>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white'
                    : 'bg-[var(--surface)] text-white border border-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--surface)] rounded-2xl px-4 py-3 border border-gray-800">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[var(--surface)] border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about inflammation, wellness, or health..."
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] text-white placeholder-[var(--muted)] border border-gray-800 focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-yellow)] text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

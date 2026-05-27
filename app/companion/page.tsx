'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { Send, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  "I'm feeling anxious",
  'Help me sleep better',
  'I need motivation',
  'How do I reduce stress?',
];

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi Alex! I'm your wellness companion. How are you feeling today? 💜",
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold">MP</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-violet-400 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function Companion() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('chat-history', JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // CLAUDE_API_CALL_2
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(0, -1),
          newMessage: trimmed,
        }),
      });

      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      toast.error('Could not connect. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="AI Companion" subtitle="Your personal wellness companion" />

      {/* Suggested prompts */}
      <div className="px-4 md:px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={loading}
              className="shrink-0 text-xs font-medium px-3.5 py-2 rounded-full bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-1 bg-[#FAFAFA]">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn('flex items-end gap-2 mb-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">MP</span>
                </div>
              )}
              <div
                className={cn(
                  'max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-5 pr-2 py-2 border border-gray-200 focus-within:border-violet-300 focus-within:bg-white transition-all">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Share what's on your mind..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-all',
              input.trim() && !loading
                ? 'bg-violet-600 hover:bg-violet-700 shadow-sm'
                : 'bg-gray-200 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          MindPulse is not a substitute for professional mental health care.
        </p>
      </div>
    </div>
  );
}

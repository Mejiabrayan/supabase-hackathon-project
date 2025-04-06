'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { Message } from '@/components/message';
import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
import { motion } from 'framer-motion';
import { suggestedActions } from '@/config/suggestions';
import EmptyStateUI from '@/components/empty-state';
import { BlogGeneratingState } from '@/components/blog-states';

export default function Home() {
  const { sendMessage, done } = useActions();
  const [uiState] = useUIState();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  // Cleanup streaming state when component unmounts
  useEffect(() => {
    return () => {
      done();
    };
  }, [done]);

  // Handle message submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    try {
      setMessages((messages) => [
        ...messages,
        <Message key={messages.length} role='user' content={input} />,
      ]);
      setInput('');

      const response: ReactNode = await sendMessage(input);
      setMessages((messages) => [...messages, response]);
    } finally {
      done(); // Ensure streaming is properly cleaned up
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div
        ref={messagesContainerRef}
        className='flex flex-col gap-3 items-center pb-32'
      >
        {uiState?.isLoading && <BlogGeneratingState />}
        {messages.length === 0 && !uiState?.isLoading && (
          <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EmptyStateUI />
          </motion.div>
        )}
        {messages.map((message, index) => (
          <React.Fragment key={index}>{message}</React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4'>
        <div className='w-full max-w-4xl mx-auto space-y-4'>
          <div className='grid sm:grid-cols-2 gap-3'>
            {messages.length === 0 &&
              suggestedActions.map((action, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={index}
                  className={index > 1 ? 'hidden sm:block' : 'block'}
                >
                  <button
                    onClick={async () => {
                      setMessages((messages) => [
                        ...messages,
                        <Message key={messages.length} role='user' content={action.action} />,
                      ]);
                      const response: ReactNode = await sendMessage(action.action);
                      setMessages((messages) => [...messages, response]);
                    }}
                    className='w-full text-left relative p-4 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.02),0_4px_8px_0_rgba(0,0,0,0.04)] ring-[0.8px] ring-black/[0.08]'
                  >
                    <div className='space-y-2'>
                      <span className='font-medium text-[#212121] block'>{action.title}</span>
                      <span className='text-slate-500 text-sm'>{action.label}</span>
                    </div>
                  </button>
                </motion.div>
              ))}
          </div>

          <form
            className='flex flex-col gap-2 relative items-center'
            onSubmit={handleSubmit}
          >
            <div className='relative w-full'>
              <input
                ref={inputRef}
                className='w-full bg-white rounded-lg px-4 py-3 text-[#212121] placeholder:text-neutral-400 border border-neutral-200 focus:border-blue-500 focus:ring-blue-500 shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] transition-all'
                placeholder='Describe what you want to write about...'
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                disabled={uiState?.isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

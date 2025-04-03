"use client";

import React, { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "motion/react";

export default function Home() {
  const { sendMessage } = useActions();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    { 
      title: "Write a blog post about", 
      label: "Next.js 15 and Server Actions", 
      action: "generateBlog:Write a detailed technical blog post about Next.js 15 and Server Actions. Focus on the new features, implementation examples, and best practices. Include code snippets and real-world use cases." 
    },
    { 
      title: "Create a guide about", 
      label: "Building AI-powered applications", 
      action: "generateBlog:Create a comprehensive guide about building AI-powered applications using Vercel AI SDK and React Server Components. Include architecture diagrams, code examples, and deployment strategies." 
    },
    {
      title: "Explain",
      label: "How to use Supabase with Next.js",
      action: "generateBlog:Write a step-by-step tutorial explaining how to integrate Supabase with Next.js. Cover authentication, database setup, real-time subscriptions, and serverless functions. Include code examples and best practices."
    },
    {
      title: "Compare",
      label: "Different AI SDKs for React",
      action: "generateBlog:Create a detailed comparison of different AI SDKs available for React applications. Compare Vercel AI SDK, LangChain, Hugging Face, and others. Include code examples, features, limitations, and use cases."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ 
          backgroundImage: 'url("/3d-gradient.png")',
          filter: 'blur(10px) brightness(1)',
          transform: 'scale(1.1)',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
      <div
        ref={messagesContainerRef}
        className="flex-1 flex flex-col gap-3 items-center p-4 relative z-10"
      >
        {messages.length === 0 && (
          <motion.div 
            className="w-full max-w-4xl pt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative p-8 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm ring-1 ring-white/10" />
              <div className="relative">
                <h2 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 text-center mb-6">
                  Create New Blog Post
                </h2>
                <p className="text-white/60 text-center mb-4">
                  Generate high-quality technical blog posts using AI. Simply describe what you want to write about, and our AI will help you create engaging content.
                </p>
                <p className="text-white/60 text-center">
                  Once generated, you can preview, edit, and publish directly to Dev.to with a single click.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {messages.map((message) => message)}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full p-4 relative z-10">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {messages.length === 0 &&
              suggestedActions.map((action, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={index}
                  className={index > 1 ? "hidden sm:block" : "block"}
                >
                  <button
                    onClick={async () => {
                      setMessages((messages) => [
                        ...messages,
                        <Message key={messages.length} role="user" content={action.action} />,
                      ]);
                      const response: ReactNode = await sendMessage(action.action);
                      setMessages((messages) => [...messages, response]);
                    }}
                    className="w-full text-left relative p-4 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm ring-1 ring-white/10 group-hover:ring-white/20" />
                    <div className="relative">
                      <span className="font-medium text-white block mb-1">{action.title}</span>
                      <span className="text-white/60">
                        {action.label}
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
          </div>

          <form
            className="flex flex-col gap-2 relative items-center"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!input.trim()) return;

              setMessages((messages) => [
                ...messages,
                <Message key={messages.length} role="user" content={input} />,
              ]);
              setInput("");

              const response: ReactNode = await sendMessage(input);
              setMessages((messages) => [...messages, response]);
            }}
          >
            <div className="relative w-full">
              <input
                ref={inputRef}
                className="w-full bg-black/40 backdrop-blur-sm ring-1 ring-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-white/20 transition-all"
                placeholder="Describe what you want to write about..."
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

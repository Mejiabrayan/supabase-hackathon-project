"use client";

import React, { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "motion/react";
import { VercelIcon } from "@/components/icons";

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
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>AI Blog Generator</span>
                </p>
                <p>
                  Generate high-quality technical blog posts using AI. Simply describe what you want to write about, and our AI will help you create engaging content.
                </p>
                <p>
                  Once generated, you can preview, edit, and publish directly to Dev.to with a single click.
                </p>
              </div>
            </motion.div>
          )}
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
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
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!input.trim()) return;

            setMessages((messages,) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);
            setInput("");

            const response: ReactNode = await sendMessage(input);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
            placeholder="Describe what you want to write about..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}

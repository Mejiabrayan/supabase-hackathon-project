import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { type ClassAttributes, type HTMLAttributes } from 'react';
import { type ExtraProps } from 'react-markdown';

interface MarkdownProps {
  content?: string;
  children?: string;
}

interface CodeProps extends ClassAttributes<HTMLElement>, HTMLAttributes<HTMLElement>, ExtraProps {
  inline?: boolean;
}

const components: Components = {
  pre: ({ children }) => (
    <pre className="overflow-auto rounded-lg bg-neutral-900 p-4">
      {children}
    </pre>
  ),
  code: ({ children, className, inline }: CodeProps) => {
    if (!inline && className?.includes('language-')) {
      return (
        <pre className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}>
          <code>{children}</code>
        </pre>
      );
    }
    return <code className="text-sm bg-zinc-100 p-1 rounded dark:bg-zinc-800">{children}</code>;
  },
  h1: ({ children }) => (
    <h1 className="mb-4 text-2xl font-bold text-neutral-900">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 text-xl font-semibold text-neutral-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 text-lg font-medium text-neutral-900">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-neutral-700">
      {children}
    </p>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside ml-4">
      {children}
    </ol>
  ),
  ul: ({ children }) => (
    <ul className="list-decimal list-inside ml-4">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="py-1">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <span className="font-semibold">
      {children}
    </span>
  ),
};

function MarkdownBase({ content, children }: MarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content || children}
    </ReactMarkdown>
  );
}

export const Markdown = React.memo(MarkdownBase, (prevProps, nextProps) => 
  prevProps.content === nextProps.content && prevProps.children === nextProps.children
);
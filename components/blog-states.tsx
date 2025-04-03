"use client";

import { BlogPreview } from '@/components/blog-editor';

export function BlogGeneratingState() {
  return (
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zinc-500"></div>
      <span>Generating your blog post...</span>
    </div>
  );
}

interface BlogSuccessStateProps {
  title: string;
  tags: string[];
  description: string;
  content: string;
  publishAction: () => Promise<string>;
}

export function BlogSuccessState({ title, tags, description, content, publishAction }: BlogSuccessStateProps) {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">✅ Blog post generated successfully!</h2>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">📝 Title:</span> {title}</p>
          <p><span className="font-medium">🏷️ Tags:</span> {tags.join(', ')}</p>
          <p><span className="font-medium">📋 Description:</span> {description}</p>
        </div>
      </div>
      <BlogPreview content={content} publishAction={publishAction} />
    </>
  );
}

interface BlogErrorStateProps {
  error: string;
}

export function BlogErrorState({ error }: BlogErrorStateProps) {
  return (
    <div className="text-red-500 flex items-center gap-2">
      <span className="text-xl">❌</span>
      <div>
        <p className="font-medium">Error generating blog post:</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );
} 
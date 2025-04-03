"use client";

import { BlogPreview } from '@/components/blog-editor';

export function BlogGeneratingState() {
  return (
    <div className="relative p-6 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
      <div className="relative flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/80"></div>
        <span className="text-white/80 font-medium">Crafting your blog post with AI magic ✨</span>
      </div>
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
    <div className="relative p-6 rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
      <div className="relative space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500/80"></div>
            <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Blog Post Generated
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-white/40 text-sm mb-1">Title</div>
              <div className="text-white text-lg">{title}</div>
            </div>

            <div>
              <div className="text-white/40 text-sm mb-2">Tags</div>
              <div className="flex gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-white/70 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-white/40 text-sm mb-1">Description</div>
              <div className="text-white/70">{description}</div>
            </div>
          </div>
        </div>

        <BlogPreview content={content} publishAction={publishAction} />
      </div>
    </div>
  );
}

interface BlogErrorStateProps {
  error: string;
}

export function BlogErrorState({ error }: BlogErrorStateProps) {
  return (
    <div className="relative p-6 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-red-500/20" />
      <div className="relative flex items-start gap-3">
        <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="text-red-500">⚠️</span>
        </div>
        <div>
          <h3 className="text-red-400 font-medium mb-1">Generation Failed</h3>
          <p className="text-red-300/70 text-sm">{error}</p>
        </div>
      </div>
    </div>
  );
} 
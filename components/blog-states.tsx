"use client";

import { BlogPreview } from '@/components/blog-editor';
import Link from 'next/link';

export function BlogGeneratingState() {
  return (
    <div className='flex flex-col gap-6 relative max-w-3xl p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
      <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
        <div className="flex items-center gap-3 p-4">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-200 border-t-blue-500"></div>
          <span className="text-neutral-700 font-medium">Crafting your blog post with AI magic ✨</span>
        </div>
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
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return (
    <div className='flex flex-col gap-6 relative max-w-5xl p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
      <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
        <div className='py-3 px-4 border-b border-neutral-100'>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-base text-neutral-700 font-medium">Blog Post Generated</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-neutral-500 text-sm mb-1 ">Title</div>
              <div className="text-[#212121] text-lg font-medium">{title}</div>
            </div>

            <div>
              <div className="text-neutral-500 text-sm mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-neutral-500 text-sm mb-1">Description</div>
              <div className="text-neutral-700">{description}</div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none" />
              <div className="prose prose-neutral max-w-none max-h-[300px] overflow-hidden">
                <div className="whitespace-pre-wrap">{content}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
            <BlogPreview publishAction={publishAction} />
            <Link
              href={`/overview/published/${slug}`}
              className="flex items-center justify-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50"
            >
              View Post
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlogErrorStateProps {
  error: string;
}

export function BlogErrorState({ error }: BlogErrorStateProps) {
  return (
    <div className='flex flex-col gap-6 relative max-w-3xl p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
      <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
        <div className="flex items-start gap-3 p-4">
          <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500">⚠️</span>
          </div>
          <div>
            <h3 className="text-red-600 font-medium mb-1">Generation Failed</h3>
            <p className="text-red-500/80 text-sm">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
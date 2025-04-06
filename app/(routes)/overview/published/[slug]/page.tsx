import React, { JSX } from 'react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Database } from '@/types/database.types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  
  // First try exact match with id
  const { data: blog } = await supabase
    .from('blog_posts')
    .select()
    .eq('id', slug)
    .single();

  // If no result, try searching by title
  if (!blog) {
    const searchTitle = slug.split('-').join(' ');
    const { data: blogByTitle, error: titleError } = await supabase
      .from('blog_posts')
      .select()
      .eq('status', 'published')
      .ilike('title', `%${searchTitle}%`)
      .single();

    if (titleError || !blogByTitle) {
      return (
        <div className="flex-1 p-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative p-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
              <div className="relative text-center">
                <h1 className="text-2xl font-medium text-white mb-4 font-display tracking-tight">Blog post not found</h1>
                <p className="text-white/60 mb-4 font-sans">Could not find blog post with title containing: {searchTitle}</p>
                <Link 
                  href="/overview/published"
                  className="text-white/80 hover:text-white underline font-medium"
                >
                  ← Back to Overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return renderBlog(blogByTitle);
  }

  return renderBlog(blog);
}

function renderBlog(blog: Database['public']['Tables']['blog_posts']['Row']) {
  return (
    <div className="flex-1 p-4">
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/overview/published"
            className="text-white/60 hover:text-white transition-colors font-medium"
          >
            ← Back to Overview
          </Link>
        </div>

        <article className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm ring-1 ring-white/10" />
          <div className="relative p-8">
            <header className="mb-5">
              <h1 className="text-2xl font-display font-medium text-white mb-2 tracking-tight leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  blog.status === 'published' ? 'bg-green-500/20 text-green-300' :
                  blog.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </span>
                <time 
                  dateTime={blog.updated_at}
                  className="text-white/40 font-mono text-xs"
                >
                  Last updated: {new Date(blog.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {blog.dev_to_url && (
                  <a
                    href={blog.dev_to_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors ml-auto font-medium"
                  >
                    View on Dev.to →
                  </a>
                )}
              </div>
            </header>
            
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {blog.content.split('\n').reduce((acc: JSX.Element[], line, i) => {
                  // Code block handling
                  if (line.startsWith('```')) {
                    const codeBlock = [];
                    let j = i + 1;
                    while (j < blog.content.split('\n').length && !blog.content.split('\n')[j].startsWith('```')) {
                      codeBlock.push(blog.content.split('\n')[j]);
                      j++;
                    }
                    acc.push(
                      <pre key={i} className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
                        <code>{codeBlock.join('\n')}</code>
                      </pre>
                    );
                    return acc;
                  }

                  // Blockquote handling
                  if (line.startsWith('>')) {
                    acc.push(
                      <blockquote key={i} className="border-l-2 border-white/20 pl-4 italic text-white/80 mb-4">
                        {line.slice(1).trim()}
                      </blockquote>
                    );
                    return acc;
                  }

                  // Heading handling
                  if (line.startsWith('# ')) {
                    acc.push(
                      <h2 key={i} className="text-xl font-display font-medium text-white mb-4 mt-8 first:mt-0">
                        {line.slice(2)}
                      </h2>
                    );
                    return acc;
                  }

                  if (line.startsWith('## ')) {
                    acc.push(
                      <h3 key={i} className="text-lg font-display font-medium text-white mb-3 mt-6 first:mt-0">
                        {line.slice(3)}
                      </h3>
                    );
                    return acc;
                  }

                  // List handling
                  if (line.startsWith('- ')) {
                    acc.push(
                      <ul key={i} className="list-disc list-inside mb-4 text-white/90">
                        <li>{line.slice(2)}</li>
                      </ul>
                    );
                    return acc;
                  }

                  // Regular paragraph handling
                  if (line.trim()) {
                    acc.push(
                      <p key={i} className="mb-4 last:mb-0 text-white/90">
                        {line}
                      </p>
                    );
                  }
                  
                  return acc;
                }, [])}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
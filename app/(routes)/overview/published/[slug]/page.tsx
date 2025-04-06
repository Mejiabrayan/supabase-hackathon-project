import React, { JSX } from 'react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Database } from '@/types/database.types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugify(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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

  // If no result, try searching by title slug
  if (!blog) {
    const { data: blogs, error: titleError } = await supabase
      .from('blog_posts')
      .select()
      .eq('status', 'published');

    if (!titleError && blogs) {
      // Find the blog post where the slugified title matches our slug
      const blogByTitle = blogs.find(post => slugify(post.title) === slug);
      
      if (blogByTitle) {
        return renderBlog(blogByTitle);
      }
    }

    return (
      <div className="flex-1">
        <div className="w-full max-w-4xl mx-auto">
          <div className='flex flex-col gap-6 relative p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
            <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
              <div className="py-3 px-4 border-b border-neutral-100">
                <h2 className="text-base text-neutral-700 font-medium">Blog post not found</h2>
                <p className="text-sm text-neutral-500">Could not find blog post with slug: {slug}</p>
              </div>
              <div className="p-4">
                <Link 
                  href="/overview/published"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  ← Back to Overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderBlog(blog);
}

function renderBlog(blog: Database['public']['Tables']['blog_posts']['Row']) {
  return (
    <div className="flex-1">
      <div className="w-full max-w-4xl mx-auto">
        <div className='flex flex-col gap-6 relative p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
          <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
            {/* Header Section */}
            <div className="py-3 px-4 border-b border-neutral-100">
              {/* <h1 className="text-xl text-neutral-700 font-medium mb-1">
                {blog.title}
              </h1> */}
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  blog.status === 'published' ? 'bg-green-100 text-green-700' : 
                  blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </span>
                <time 
                  dateTime={blog.updated_at}
                  className="text-neutral-500 font-mono text-xs"
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
                    className="text-blue-500 hover:text-blue-600 transition-colors ml-auto font-medium flex items-center gap-1"
                  >
                    View on Dev.to
                    <span className="inline-block">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              <div className="prose prose-neutral prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-lg prose-pre:p-0 prose-code:bg-gray-100/50 prose-code:text-neutral-700  prose-code:font-normal max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                  {blog.content.split('\n').reduce((acc: JSX.Element[], line, i) => {
                    // Code block handling
                    if (line.startsWith('```')) {
                      const language = line.slice(3).trim();
                      const codeBlock = [];
                      let j = i + 1;
                      while (j < blog.content.split('\n').length && !blog.content.split('\n')[j].startsWith('```')) {
                        codeBlock.push(blog.content.split('\n')[j]);
                        j++;
                      }
                      acc.push(
                        <div key={i} className="not-prose relative">
                          {language && (
                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-neutral-500 bg-neutral-50 border-l border-b border-neutral-200 rounded-bl">
                              {language}
                            </div>
                          )}
                          <pre className="!mt-0 !mb-4">
                            <code className="block p-4 text-[13px] leading-relaxed">
                              {codeBlock.join('\n')}
                            </code>
                          </pre>
                        </div>
                      );
                      return acc;
                    }

                    // Inline code handling
                    if (line.includes('`')) {
                      const parts = line.split('`');
                      if (parts.length > 1) {
                        acc.push(
                          <p key={i} className="mb-4 last:mb-0 text-neutral-700">
                            {parts.map((part, index) => {
                              if (index % 2 === 0) {
                                return part;
                              }
                              return <code key={index} className="bg-neutral-50 px-1.5 py-0.5 rounded text-[13px]">{part}</code>;
                            })}
                          </p>
                        );
                        return acc;
                      }
                    }

                    // Blockquote handling
                    if (line.startsWith('>')) {
                      acc.push(
                        <blockquote key={i} className="border-l-2 border-neutral-200 pl-4 italic text-neutral-600 mb-4">
                          {line.slice(1).trim()}
                        </blockquote>
                      );
                      return acc;
                    }

                    // Heading handling
                    if (line.startsWith('# ')) {
                      acc.push(
                        <h2 key={i} className="text-xl font-medium text-neutral-700 mb-4 mt-8 first:mt-0">
                          {line.slice(2)}
                        </h2>
                      );
                      return acc;
                    }

                    if (line.startsWith('## ')) {
                      acc.push(
                        <h3 key={i} className="text-lg font-medium text-neutral-700 mb-3 mt-6 first:mt-0">
                          {line.slice(3)}
                        </h3>
                      );
                      return acc;
                    }

                    // List handling
                    if (line.startsWith('- ')) {
                      acc.push(
                        <ul key={i} className="list-disc list-inside mb-4 text-neutral-700">
                          <li>{line.slice(2)}</li>
                        </ul>
                      );
                      return acc;
                    }

                    // Regular paragraph handling
                    if (line.trim()) {
                      acc.push(
                        <p key={i} className="mb-4 last:mb-0 text-neutral-700">
                          {line}
                        </p>
                      );
                    }
                    
                    return acc;
                  }, [])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
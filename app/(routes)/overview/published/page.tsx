'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface PublishedBlog {
  id: string;
  title: string;
  dev_to_url: string | null;
  created_at: string;
}

export default function PublishedBlogs() {
  const [blogs, setBlogs] = useState<PublishedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublishedBlogs() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, dev_to_url, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBlogs(data);
      }
      setLoading(false);
    }

    fetchPublishedBlogs();
  }, []);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col gap-4 px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative p-8 rounded-lg overflow-hidden mb-8">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
            <div className="relative">
              <h2 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2">
                Published Blog Posts
              </h2>
              <p className="text-white/60">
                View and manage your published articles on Dev.to
              </p>
            </div>
          </div>

          {loading ? (
            <div className="relative p-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
              <div className="relative flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/80"></div>
                <span className="text-white/80">Loading your published posts...</span>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="relative p-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
              <div className="relative text-center">
                <p className="text-white/60 mb-4">No published blog posts yet</p>
                <Link 
                  href="/overview" 
                  className="text-white/80 hover:text-white underline"
                >
                  Create your first blog post →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="relative p-6 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-white/40 text-sm">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {blog.dev_to_url && (
                      <a
                        href={blog.dev_to_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        View on Dev.to →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
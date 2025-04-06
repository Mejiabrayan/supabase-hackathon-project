'use client';

import Link from 'next/link';

interface PublishedBlog {
  id: string;
  title: string;
  dev_to_url: string | null;
  created_at: string;
  content: string | null;
}

interface BlogListProps {
  initialBlogs: PublishedBlog[] | null;
  error: string | null;
}

export function BlogList({ initialBlogs, error }: BlogListProps) {
  const getSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (error) {
    return (
      <div className="relative p-6 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-red-500/20" />
        <div className="relative flex items-center gap-3">
          <span className="text-red-400">⚠️ Failed to load blog posts</span>
        </div>
      </div>
    );
  }

  if (!initialBlogs || initialBlogs.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4">
      {initialBlogs.map((blog) => (
        <div key={blog.id} className="relative p-6 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] group">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm ring-1 ring-white/10 group-hover:ring-white/20" />
          <div className="relative flex items-center justify-between">
            <Link 
              href={`/overview/published/${getSlug(blog.title)}`}
              className="flex-1 min-w-0"
            >
              <h3 className="text-lg font-medium text-white mb-2 truncate pr-4">
                {blog.title}
              </h3>
              <div className="flex items-center gap-4">
                <p className="text-white/40 text-sm">
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {blog.content && (
                  <p className="text-white/40 text-sm">
                    {blog.content.length} characters
                  </p>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-4">
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
              <Link
                href={`/overview/published/${getSlug(blog.title)}`}
                className="text-white/60 group-hover:text-white text-sm transition-colors"
              >
                Edit →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
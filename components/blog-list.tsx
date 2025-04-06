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
      <div className="relative p-6 rounded-lg overflow-hidden bg-white shadow-[0_0_0_1px_rgba(220,38,38,0.1)] border-red-100">
        <div className="flex items-center gap-3">
          <span className="text-red-600">⚠️ Failed to load blog posts</span>
        </div>
      </div>
    );
  }

  if (!initialBlogs || initialBlogs.length === 0) {
    return (
      <div className="relative p-6 rounded-lg overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">No published blog posts yet</p>
          <Link 
            href="/overview" 
            className="text-blue-500 hover:text-blue-600 transition-colors"
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
        <div key={blog.id} className="relative p-6 rounded-lg overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12)] group">
          <div className="relative flex items-center justify-between">
            <Link 
              href={`/overview/published/${getSlug(blog.title)}`}
              className="flex-1 min-w-0"
            >
              <h3 className="text-lg font-medium text-neutral-700 mb-2 truncate pr-4">
                {blog.title}
              </h3>
              <div className="flex items-center gap-4">
                <p className="text-neutral-500 text-sm">
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {blog.content && (
                  <p className="text-neutral-500 text-sm">
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
                  className="text-blue-500 hover:text-blue-600 text-sm transition-colors"
                >
                  View on Dev.to →
                </a>
              )}
              <Link
                href={`/overview/published/${getSlug(blog.title)}`}
                className="text-blue-500 group-hover:text-blue-600 text-sm transition-colors"
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
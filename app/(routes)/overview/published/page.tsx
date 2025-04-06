import { createClient } from '@/utils/supabase/server';
import { BlogList } from '../../../../components/blog-list';
import { cookies } from 'next/headers';

export default async function PublishedBlogs() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  
  const { data: blogs, error } = await supabase
    .from('blog_posts')
    .select('id, title, dev_to_url, created_at, content')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

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

          <BlogList initialBlogs={blogs} error={error?.message} />
        </div>
      </div>
    </div>
  );
} 
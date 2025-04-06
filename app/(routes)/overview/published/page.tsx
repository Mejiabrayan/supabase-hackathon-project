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
          <div className='flex flex-col gap-6 relative p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
            <div className="flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg">
              <div className="py-3 px-4 border-b border-neutral-100">
                <h2 className="text-base text-neutral-700 font-medium">Published Blog Posts</h2>
                <p className="text-sm text-neutral-500">View and manage your published articles on Dev.to</p>
              </div>

              <div className="p-4">
                <BlogList initialBlogs={blogs} error={error?.message || null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
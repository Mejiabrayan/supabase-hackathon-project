import Spline from '@splinetool/react-spline/next';
import { ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/overview');
  }
  return (
    <div className='relative min-h-screen bg-black isolate'>
      <div className='absolute top-0 left-0 w-full h-full backdrop-blur-sm px-4 py-2'>
        <Link href='/' className='text-white'>
          <ArrowLeft className='text-white' />
        </Link>
      </div>
      {/* Background layer */}
      <div className='absolute inset-0' />

      {/* Spline layer */}
      <div className='absolute inset-0'>
        <Spline
          scene='https://prod.spline.design/sVmrHFB5ygNugvYZ/scene.splinecode'
          className='w-full h-full'
        />
      </div>

      {/* Content layer */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen'>
        
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">DevGenius</h1>
          <p className="text-white/60 text-lg">AI-powered blog posts, instantly published to Dev.to</p>
        </div>
        {children}
      </div>
    </div>
  );
}

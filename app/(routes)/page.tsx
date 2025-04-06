'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className='relative flex flex-col items-center justify-center w-full gap-1 md:gap-2 px-4 md:px-0 min-h-screen'>
      <div
        className='w-full max-w-full md:max-w-[85%] aspect-video md:aspect-[16/7] relative flex items-center justify-center'
        style={{
          maskImage: 'linear-gradient(to bottom, #000 0%, transparent 70%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 0%, transparent 90%)',
        }}
      >
        <Image
          src='/mock.png'
          alt='Background Pattern'
          fill
          className='object-cover'
          priority
        />
      </div>

      <h1 className='text-center text-5xl md:text-8xl lg:text-9xl z-10 font-normal leading-[1.1] md:leading-[1] tracking-tight mt-[-4rem] md:mt-[-8rem] mb-2 md:mb-4 whitespace-normal md:whitespace-nowrap mx-auto text-gray-600'>
        DevGenius
      </h1>

      <p className='max-w-[80ch] w-[95%] px-4 md:px-12 mx-auto text-gray-500 text-base md:text-xl text-center italic mb-6 md:mb-8'>
        Create SEO-optimized technical content and publish to Dev.to in minutes .{' '}
        <span className='font-medium text-blue-500 underline'>
          Start writing for free.
        </span>
      </p>

      <div className='mt-4'>
        <a
          href='/overview'
          className='inline-flex items-center justify-center gap-2 shadow-md inset-shadow-sm inset-shadow-white/20 ring ring-blue-600 inset-ring inset-ring-white/15 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-normal tracking-wide px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-400 transition-all'
        >
          Start writing
          <svg
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

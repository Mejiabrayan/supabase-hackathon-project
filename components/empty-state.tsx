'use client';

import React from 'react';
import { MotionConfig, motion, type Transition } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

const transition: Transition = { type: 'spring', bounce: 0, duration: 0.5 };

const Context = React.createContext<{
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}>({ status: '', setStatus: () => null });

function PenIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#666666'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#666666'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' />
      <path d='M9 18h6' />
      <path d='M10 22h4' />
    </svg>
  );
}

function OpenBookIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#666666'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-book-open-text'
    >
      <path d='M12 7v14' />
      <path d='M16 12h2' />
      <path d='M16 8h2' />
      <path d='M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' />
      <path d='M6 12h2' />
      <path d='M6 8h2' />
    </svg>
  );
}

export default function EmptyStateUI() {
  const [status, setStatus] = React.useState('idle');
  const isUI = status === 'ui';

  React.useEffect(() => {
    function escapeKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setStatus('idle');
      }
    }
    window.addEventListener('keydown', escapeKey);
    return () => window.removeEventListener('keydown', escapeKey);
  }, [setStatus]);

  React.useEffect(() => {
    if (status === 'loading') {
      const successTimeout = setTimeout(() => setStatus('success'), 2000);
      return () => clearTimeout(successTimeout);
    }
    if (status === 'success') {
      const idleTimeout = setTimeout(() => setStatus('ui'), 2000);
      return () => clearTimeout(idleTimeout);
    }
  }, [status, setStatus]);

  return (
    <Context.Provider value={{ status, setStatus }}>
      <MotionConfig transition={transition}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative flex h-[calc(100vh-10rem)] md:h-[calc(100vh-20rem)] items-center justify-center'
        >
          <div className='group relative flex w-full max-w-[620px] flex-col items-center justify-center gap-6 overflow-hidden rounded-md p-14 '>
            <div className='flex'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='size-20 relative left-3 flex rotate-[-403deg] items-center justify-center rounded-xl bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.02),0_4px_8px_0_rgba(0,0,0,0.04)] ring-[0.8px] ring-black/[0.08] transition-transform duration-500 group-hover:-translate-x-5 group:rotate-[-8deg] group-hover:duration-200'
              >
                <PenIcon />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='size-20 relative z-10 -mt-1 flex items-center justify-center rounded-xl bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.02),0_4px_8px_0_rgba(0,0,0,0.04)] ring-[0.8px] ring-black/[0.08] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:duration-200'
              >
                <LightbulbIcon />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='size-20 relative right-3 flex rotate-[4deg] items-center justify-center rounded-xl bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.02),0_4px_8px_0_rgba(0,0,0,0.04)] ring-[0.8px] ring-black/[0.08] transition-transform duration-500 group-hover:translate-x-5 group-hover:duration-200'
              >
                <OpenBookIcon />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='flex flex-col items-center justify-center space-y-4'
            >
              <div className='max-w-[240px] space-y-1 text-center'>
                <motion.h3 layout className='font-medium text-black text-lg md:text-2xl'>
                  {isUI ? 'No Blog Created' : 'No blog created'}
                </motion.h3>
                <p className='text-base md:text-lg text-slate-500 tracking-tight'>
                  Create and publish your first blog post
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </MotionConfig>
    </Context.Provider>
  );
}

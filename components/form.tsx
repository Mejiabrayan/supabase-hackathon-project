import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { AuthState } from '@/types/actions';

interface formProps {
  mode: 'signin' | 'signup';
  formAction: (formData: FormData) => void;
  isLoading?: boolean;
  className?: string;
  state?: AuthState;
}

export function Form({
  mode = 'signup',
  formAction,
  isLoading = false,
  className = '',
  state,
}: formProps) {
  const title = mode === 'signup' ? 'Sign up' : 'Sign in';
  const subtitle = mode === 'signup' ? 'Create your account' : 'Welcome back';
  const buttonText = mode === 'signup' ? 'Sign Up' : 'Sign In';
  const loadingText = mode === 'signup' ? 'Signing up...' : 'Signing in...';
  const footerText =
    mode === 'signup' ? 'Already have an account?' : "Don't have an account?";
  const footerLinkText = mode === 'signup' ? 'Sign in' : 'Sign up';
  const footerLinkHref = mode === 'signup' ? '/auth/sign-in' : '/auth/sign-up';

  return (
    <div className={`relative w-full max-w-md h-auto p-8 ${className}`}>
      <div className='absolute ring ring-white/15 rounded-lg p-0 inset-0 bg-black/50 backdrop-blur-sm '></div>
      <div
        style={{
          position: 'relative',
          fontFamily: 'sans-serif',
          fontSize: '1rem',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(2px)',
          color: 'white',
          borderRadius: '12px',
          width: '100%',
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            zIndex: -1,
            inset: '0px',
            borderRadius: 'inherit',
            padding: '0.5px',
            background:
              'linear-gradient(to bottom right, #171717 0%, #525252 62%, #171717 100%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#ffffff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className='mb-6 text-center'>
          <h1 className='text-xl font-medium text-white'>{title}</h1>
          <p className='text-gray-400 text-sm mt-2'>{subtitle}</p>
        </div>

        {state?.error && (
          <div className='mb-4 p-3 text-sm text-red-500 bg-red-950/20 border border-red-900/30 rounded'>
            {state.error}
          </div>
        )}

        {state?.success && state?.message && (
          <div className='mb-4 p-3 text-sm text-green-500 bg-green-950/20 border border-green-900/30 rounded'>
            {state.message}
          </div>
        )}

        <form action={formAction} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-gray-300'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='you@example.com'
              required
              className='bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/5 h-12 active:ring-white/5 active:bg-transparent autofill:bg-black'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password' className='text-gray-300'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              required
              className='bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:ring-white/5 h-12 active:ring-white/5 active:bg-transparent'
            />
          </div>

          <div className='pt-2'>
            <Button
              type='submit'
              className='w-full bg-[rgba(255,255, 255, 0.03)] '
              disabled={isLoading}
            >
              {isLoading ? loadingText : buttonText}
            </Button>
          </div>

          <div className='text-center text-sm text-gray-400 pt-2'>
            {footerText}{' '}
            <Link href={footerLinkHref} className='text-white hover:underline'>
              {footerLinkText}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

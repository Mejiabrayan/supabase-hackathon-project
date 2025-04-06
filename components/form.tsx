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
  state?: AuthState;
}

export function Form({
  mode = 'signup',
  formAction,
  isLoading = false,
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
    <div className='flex flex-col gap-6 relative max-w-lg p-4 mt-2 w-full transition-colors bg-gray-100/50 backdrop-blur-xs rounded-xl'>
      <div className='flex flex-col bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-lg'>
        <div className='py-3 px-4 border-b border-neutral-100'>
          <h2 className='text-base text-neutral-700 font-medium'>{title}</h2>
          <p className='text-sm text-neutral-500'>{subtitle}</p>
        </div>

        <div className='py-3 px-4'>
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

          <form action={formAction}>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm text-neutral-700'>
                  Email
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  required
                  className='rounded-md border-neutral-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center'>
                  <Label
                    htmlFor='password'
                    className='text-sm text-neutral-700'
                  >
                    Password
                  </Label>
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto inline-block text-sm text-blue-500 hover:text-blue-600 underline-offset-4 hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='••••••••'
                  required
                  className='rounded-md border-neutral-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div className='border-t py-3 px-4 w-[calc(100%+32px)] !mb-3 flex justify-end mt-4 -mx-4'>
                <Button
                  type='submit'
                  className='shadow-md inset-shadow-sm inset-shadow-white/20 ring ring-blue-600 inset-ring inset-ring-white/15 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-normal tracking-wide px-6 py-2'
                  disabled={isLoading}
                >
                  {isLoading ? loadingText : buttonText}
                </Button>
              </div>
            </div>
            <div className=' mt-4 text-center text-sm text-neutral-600'>
              {footerText}{' '}
              <Link
                href={footerLinkHref}
                className='text-blue-500 hover:text-blue-600 underline underline-offset-4'
              >
                {footerLinkText}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

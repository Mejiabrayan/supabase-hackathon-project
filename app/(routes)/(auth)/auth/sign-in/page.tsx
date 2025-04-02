'use client';

import { Form } from '@/components/form';
import { useActionState } from 'react';
import { AuthState } from '@/types/actions';
import { signIn } from '@/app/actions';

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState<AuthState>(
    signIn as unknown as (state: AuthState) => Promise<AuthState>,
    {}
  );

  return (
    <>
      <Form
        mode='signin'
        formAction={formAction}
        isLoading={isPending}
        state={state}
      />
    </>
  );
}

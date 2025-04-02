'use client';

import { useActionState } from 'react';
import { signUp } from '@/app/actions';
import { Form } from '@/components/form';
import type { AuthState } from '@/types/actions';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<AuthState>(
    signUp as unknown as (state: AuthState) => Promise<AuthState>,
    {}
  );

  return (
    <>
      <Form
        mode='signup'
        formAction={formAction}
        isLoading={isPending}
        state={state}
      />
    </>
  );
}

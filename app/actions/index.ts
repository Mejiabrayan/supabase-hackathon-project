'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { AuthState, ServerAction } from '@/types/actions';

export const signIn: ServerAction<AuthState> = async (
  prevState,
  formData: FormData
) => {
  const cookieStore = cookies();
  console.log('cookieStore, bro', cookieStore);
  const supabase = await createClient(cookieStore);

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  if (authData?.user?.email) {
    const now = new Date().toISOString();

    const cookieStore = await cookies();
    cookieStore.set(`last_sign_in`, now, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  revalidatePath('/', 'layout');
  redirect('/overview');
};

export const signUp: ServerAction<AuthState> = async (
  prevState,
  formData: FormData
) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp(data);

    if (signUpError) {
      return {
        error: signUpError.message,
        success: false,
      };
    }

    if (!authData.user) {
      return {
        error: 'Something went wrong. Please try again.',
        success: false,
      };
    }

    // The user row will be automatically created by our trigger
    // We can verify it was created
    const { error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Error verifying user creation:', userError);
      // We don't return this error to the client since the signup was successful
    }

    return {
      success: true,
      message: 'Please check your email to confirm your account.',
    };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
};

export async function signOut() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/auth/sign-in');
}


export async function getUser() {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      redirect('/auth/sign-in');
    }
  
    return user;
  }
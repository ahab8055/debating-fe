'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverApi } from '@/lib/api';
import type { User, LoginResponse, AuthFormState, SignUpResponse } from '@/types/auth';

// Helper functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

// Session management
export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value;
}

// Sign in action
export async function signIn(formData: FormData): Promise<AuthFormState | undefined> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validation
  const errors: AuthFormState['errors'] = {};
  
  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const formData = new URLSearchParams({
      username: email,
      password: password,
      grant_type: 'password',
    });

    const response = await serverApi.postForm<LoginResponse>('/auth/login', formData);
    await createSession(response.access_token);
    
  } catch (error) {
    return {
      errors: {
        general: error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
      },
    };
  }

  redirect('/dashboard');
}

// Sign up action
export async function signUp(formData: FormData): Promise<AuthFormState | undefined> {
  const full_name = formData.get('full_name') as string;
  const user_name = formData.get('user_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validation
  const errors: AuthFormState['errors'] = {};
  
  if (!full_name || full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters long';
  }
  
  if (!user_name || user_name.trim().length < 2) {
    errors.user_name = 'Username must be at least 2 characters long';
  }
  
  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters long';
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await serverApi.post<SignUpResponse>('/auth/signup/', {
      email: email.toLowerCase(),
      password,
      full_name: full_name.trim(),
      user_name: user_name.trim(),
    });

    // After successful signup, automatically sign in the user
    const loginFormData = new FormData();
    loginFormData.append('email', email);
    loginFormData.append('password', password);
    
    return await signIn(loginFormData);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
      return {
        errors: {
          email: 'An account with this email already exists',
        },
      };
    }
    
    return {
      errors: {
        general: 'Failed to create account. Please try again.',
      },
    };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  try {
    const user = await serverApi.get<User>('/auth/me', session);
    return user;
  } catch {
    // Session is invalid, clear it
    await deleteSession();
    return null;
  }
}

// Logout action
export async function logout() {
  await deleteSession();
  redirect('/auth/login');
}

export async function requestPasswordReset(formData: FormData): Promise<AuthFormState | undefined> {
  const email = formData.get('email') as string;
  
  // Validate input
  if (!email || !validateEmail(email)) {
    return {
      errors: {
        email: 'Please enter a valid email address',
      },
    };
  }

  try {
    await serverApi.post('/auth/forgot-password/', { email });
    
    // Even if email doesn't exist, we return success to prevent user enumeration
    return undefined;
  } catch (error: unknown) {
    console.error('Password reset request failed:', error);
    
    return {
      errors: {
        general: 'Failed to send password reset email. Please try again.',
      },
    };
  }
}

export async function resetPassword(formData: FormData): Promise<AuthFormState | undefined> {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  
  // Validate input
  if (!token) {
    return {
      errors: {
        general: 'Invalid or expired reset token',
      },
    };
  }

  if (!password || !validatePassword(password)) {
    return {
      errors: {
        password: 'Password must be at least 8 characters long',
      },
    };
  }

  try {
    await serverApi.post('/auth/reset-password/', {
      token,
      new_password: password,
    });

    return undefined;
  } catch (error: unknown) {
    console.error('Password reset failed:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 400) {
        return {
          errors: {
            general: 'Invalid or expired reset token',
          },
        };
      }
    }

    return {
      errors: {
        general: 'Failed to reset password. Please try again.',
      },
    };
  }
}

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

export async function setOTPEmail(email: string) {
  const cookieStore = await cookies();
  cookieStore.set('otp_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  });
}

export async function getOTPEmail() {
  const cookieStore = await cookies();
  return cookieStore.get('otp_email')?.value;
}

export async function deleteOTPEmail() {
  const cookieStore = await cookies();
  cookieStore.delete('otp_email');
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
export async function signIn(formData: { username: string; password: string }): Promise<AuthFormState | undefined> {
  const username = formData.username;
  const password = formData.password;

  // Validation
  const errors: AuthFormState['errors'] = {};

  if (!username || username.trim().length < 2) {
    errors.username = 'Username must be at least 2 characters long';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const formData = new URLSearchParams({
      username: username,
      password: password,
      grant_type: 'password',
    });

    const response = await serverApi.postForm<LoginResponse>('/auth/login', formData);
    await createSession(response.access_token);

    // Return success state instead of redirecting here
    return { success: true };
  } catch (error) {
    return {
      errors: {
        general:
          error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
      },
    };
  }
}

// Sign up action
export async function signUp(data: {
  full_name: string;
  user_name: string;
  email: string;
  password: string;
}): Promise<AuthFormState | undefined> {
  const { full_name, user_name, email, password } = data;

  // Validation
  const errors: AuthFormState['errors'] = {};

  if (!full_name || full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters long';
  }

  if (!user_name || user_name.trim().length < 2) {
    errors.username = 'Username must be at least 2 characters long';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters long';
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

    // Store email temporarily for OTP verification
    await setOTPEmail(email.toLowerCase());
    
    // Don't auto-login, redirect to OTP verification instead
    return { success: true };

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
    const { User: user } = await serverApi.get<{ User: User }>('/auth/me', session);
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

// OTP verification action
export async function verifyOTP(formData: { otp: string }): Promise<AuthFormState | undefined> {
  const { otp } = formData;
  
  // Get email from temporary storage
  const email = await getOTPEmail();
  
  if (!email) {
    return {
      errors: {
        general: 'Verification session expired. Please sign up again.',
      },
    };
  }

  // Validate input
  if (!otp || otp.length !== 6) {
    return {
      errors: {
        general: 'Please enter a valid 6-digit OTP code',
      },
    };
  }

  try {
    // Verify OTP with backend
    const response = await serverApi.post<LoginResponse>('/auth/verify-otp', {
      email,
      otp,
      otp_expiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    });

    // Clean up temporary email storage
    await deleteOTPEmail();

    // If OTP verification is successful and returns a token, create session
    if (response.access_token) {
      await createSession(response.access_token);
      return { success: true };
    }

    // If verification successful but no token (shouldn't happen)
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired OTP code';
    return {
      errors: {
        general: errorMessage,
      },
    };
  }
}

// Resend OTP action
export async function resendOTP(): Promise<AuthFormState | undefined> {
  // Get email from temporary storage
  const email = await getOTPEmail();
  
  if (!email) {
    return {
      errors: {
        general: 'Verification session expired. Please sign up again.',
      },
    };
  }

  try {
    await serverApi.post('/auth/resend-otp', { email });
    return undefined; // Success
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
    return {
      errors: {
        general: errorMessage,
      },
    };
  }
}

// Get OTP email for display (masks email for security)
export async function getOTPEmailForDisplay(): Promise<string | null> {
  const email = await getOTPEmail();
  if (!email) {
    return null;
  }
  
  // Mask email for display (e.g., "u***@example.com")
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(Math.max(0, username.length - 2)) + (username.length > 1 ? username.slice(-1) : '');
  return `${maskedUsername}@${domain}`;
}

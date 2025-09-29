'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PasswordResetForm } from '@/components/auth/password-reset-form';
import { useToast } from '@/stores';

export function PasswordResetClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [token, setToken] = useState<string>('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      showToast({
        type: 'error',
        title: 'Invalid Link',
        message: 'This password reset link is invalid or expired.',
      });
      setIsValidToken(false);
      return;
    }
    
    setToken(tokenParam);
    setIsValidToken(true);
  }, [searchParams, showToast]);

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Password Reset Complete',
      message: 'Your password has been successfully reset. You can now sign in.',
    });
    router.push('/auth/login');
  };

  if (isValidToken === null) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Validating reset link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="text-center space-y-6">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Invalid Reset Link</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/auth/forgot-password"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Request New Reset Link
          </Link>
          <Link
            href="/auth/login"
            className="block w-full text-blue-600 hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
          ← Back to Sign In
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Set New Password</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-50">
          Enter a new password for your account.
        </p>
      </div>

      <PasswordResetForm token={token} onSuccess={handleSuccess} />

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Having trouble?{' '}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

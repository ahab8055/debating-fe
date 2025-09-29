import { Suspense } from 'react';
import { Metadata } from 'next';
import { PasswordResetClient } from './reset-client';

export const metadata: Metadata = {
  title: 'Reset Password - Debating Platform',
  description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <PasswordResetClient />
        </Suspense>
      </div>
    </div>
  );
}

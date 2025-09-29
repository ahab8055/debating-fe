import { Suspense } from 'react';
import { Metadata } from 'next';
import { PasswordResetClient } from './reset-client';

export const metadata: Metadata = {
  title: 'Reset Password - Debating Platform',
  description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PasswordResetClient />
      </Suspense>
    </div>
  );
}

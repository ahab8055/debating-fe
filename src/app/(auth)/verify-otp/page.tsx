import { Suspense } from 'react';
import { Metadata } from 'next';
import { OTPVerificationClient } from './otp-client';

export const metadata: Metadata = {
  title: 'Verify Your Email - Debating Platform',
  description: 'Enter the verification code sent to your email address',
};

export default function OTPVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <OTPVerificationClient />
        </Suspense>
      </div>
    </div>
  );
}

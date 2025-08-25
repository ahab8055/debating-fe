'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OTPVerification } from '@/components/auth/otp-verification';
import { useToast } from '@/stores';

export function OTPVerificationClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) {
      showToast({
        type: 'error',
        title: 'Missing Email',
        message: 'No email address provided for verification.',
      });
      router.push('/signup');
      return;
    }
    setEmail(emailParam);
  }, [searchParams, router, showToast]);

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Email Verified',
      message: 'Your email has been verified successfully!',
    });
    router.push('/auth/login');
  };

  const handleCancel = () => {
    router.push('/signup');
  };

  if (!email) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8">
        <Link href="/signup" className="text-blue-600 hover:underline text-sm">
          ← Back to Sign Up
        </Link>
      </div>
      
      <OTPVerification
        email={email}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Having trouble?{' '}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

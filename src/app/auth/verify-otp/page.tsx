import { Metadata } from 'next';
import { OTPVerification } from '@/components/auth/otp-verification';

export const metadata: Metadata = {
  title: 'Verify Your Email - Debating Platform',
  description: 'Enter the verification code sent to your email address',
};

export default function OTPVerificationPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Verify Your Email
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to your email address
        </p>
      </div>
      
      <OTPVerification />
    </div>
  );
}

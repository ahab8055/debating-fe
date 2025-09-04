import { Metadata } from 'next';
import Link from 'next/link';
import { PasswordResetRequestForm } from '@/components/auth/password-reset-request-form';

export const metadata: Metadata = {
  title: 'Reset Password - Debating Platform',
  description: 'Request a password reset link for your account',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8">
            <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
              ← Back to Sign In
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <PasswordResetRequestForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

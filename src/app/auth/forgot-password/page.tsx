import { Metadata } from 'next';
import Link from 'next/link';
import { PasswordResetRequestForm } from '@/components/auth/password-reset-request-form';

export const metadata: Metadata = {
  title: 'Reset Password - Debating Platform',
  description: 'Request a password reset link for your account',
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <Link href="/login" className="text-blue-600 hover:underline text-sm">
          ← Back to Sign In
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reset Your Password</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-50">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <PasswordResetRequestForm />

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

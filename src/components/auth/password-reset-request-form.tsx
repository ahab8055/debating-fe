'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from '@/actions/auth';
import { useToast } from '@/stores';
import { passwordResetRequestSchema, type PasswordResetRequestData } from '@/schemas/auth';

export function PasswordResetRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  async function onSubmit(data: PasswordResetRequestData) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      
      const result = await requestPasswordReset(formData);
      if (result?.errors) {
        if (result.errors.general) {
          showToast({
            type: 'error',
            title: 'Request Failed',
            message: result.errors.general,
          });
        }
      } else {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Password reset email sent! Check your inbox.',
        });
        setEmailSent(true);
      }
    } catch(error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'Request Failed',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.44a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
          <p className="mt-2 text-gray-600">
            We&apos;ve sent a password reset link to your email address. 
            Click the link in the email to reset your password.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setEmailSent(false)}
            className="text-blue-600 hover:underline text-sm"
          >
            Didn&apos;t receive the email? Try again
          </button>
          <div>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-blue-600 hover:underline text-sm"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            id="email"
            type="email"
            label="Email Address"
            className="mt-1"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Email'}
      </Button>
    </form>
  );
}

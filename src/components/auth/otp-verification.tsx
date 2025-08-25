'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useToast } from '@/stores';
import { otpSchema, type OTPData } from '@/schemas/auth';

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function OTPVerification({ email, onSuccess, onCancel }: OTPVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
  });

  async function onSubmit(data: OTPData) {
    setIsLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        email,
        otp: data.otp,
        otp_expiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
      });

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Email verified successfully!',
      });
      onSuccess();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Verification Failed',
        message: error instanceof Error ? error.message : 'Invalid or expired OTP code',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOTP = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      showToast({
        type: 'success',
        title: 'OTP Sent',
        message: 'A new OTP code has been sent to your email.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Failed to Send OTP',
        message: 'Please try again later.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify Your Email</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            id="otp"
            type="text"
            label="Enter 6-digit code"
            className="mt-1 text-center text-lg tracking-widest"
            maxLength={6}
            placeholder="000000"
            {...register('otp')}
            error={errors.otp?.message}
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <Button 
            type="button" 
            onClick={onCancel}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button 
          className="text-blue-600 hover:underline text-sm"
          onClick={handleResendOTP}
          type="button"
        >
          Didn&apos;t receive the code? Resend
        </button>
      </div>
    </div>
  );
}

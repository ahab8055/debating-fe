'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { verifyOTP, resendOTP, getOTPEmailForDisplay } from '@/actions/auth';
import { useToast } from '@/stores';

export function OTPVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMaskedEmail = async () => {
      const email = await getOTPEmailForDisplay();
      if (email) {
        setMaskedEmail(email);
      } else {
        // No email found, redirect to signup
        showToast({
          type: 'error',
          title: 'Session Expired',
          message: 'Verification session expired. Please sign up again.',
        });
        window.location.href = '/auth/signup';
      }
    };
    fetchMaskedEmail();
  }, [showToast]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      return; // Only allow single character
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Only numbers
    
    if (pastedData.length <= 6) {
      const newOtp = new Array(6).fill('');
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError('');
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  async function handleSubmit() {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyOTP({
        otp: otpValue,
      });

      if (result?.errors) {
        setError(result.errors.general || 'Invalid or expired OTP code');
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: result.errors.general || 'Invalid or expired OTP code',
        });
      } else {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Email verified successfully! You are now logged in.',
        });
        // Redirect to dashboard since user is now logged in
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid or expired OTP code';
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'Verification Failed',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP();
      
      if (result?.errors) {
        showToast({
          type: 'error',
          title: 'Failed to Send OTP',
          message: result.errors.general || 'Please try again later.',
        });
      } else {
        showToast({
          type: 'success',
          title: 'OTP Sent',
          message: 'A new OTP code has been sent to your email.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Failed to Send OTP',
        message: 'Please try again later.',
      });
    }
  };

  if (!maskedEmail) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to <strong>{maskedEmail}</strong>
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Enter 6-digit code
          </label>
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isLoading || otp.join('').length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </div>

      <div className="text-center space-y-4">
        <button 
          className="text-blue-600 hover:underline text-sm"
          onClick={handleResendOTP}
          type="button"
          disabled={isLoading}
        >
          Didn&apos;t receive the code? Resend
        </button>
        
        <div>
          <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline">
            ← Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

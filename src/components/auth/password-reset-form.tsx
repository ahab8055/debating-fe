'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/actions/auth';
import { useToast } from '@/stores';
import { passwordResetSchema, type PasswordResetData } from '@/schemas/auth';

interface PasswordResetFormProps {
  token: string;
  onSuccess?: () => void;
}

export function PasswordResetForm({ token, onSuccess }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token,
    },
  });

  async function onSubmit(data: PasswordResetData) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('token', data.token);
      formData.append('password', data.password);
      
      const result = await resetPassword(formData);
      if (result?.errors) {
        if (result.errors.general) {
          showToast({
            type: 'error',
            title: 'Reset Failed',
            message: result.errors.general,
          });
        }
      } else {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Password reset successfully! You can now sign in.',
        });
        reset();
        onSuccess?.();
      }
    } catch(error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('token')} />
      
      <div className="space-y-4">
        <div>
          <Input
            id="password"
            type="password"
            label="New Password"
            className="mt-1"
            placeholder="Enter your new password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
        
        <div>
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            className="mt-1"
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
}

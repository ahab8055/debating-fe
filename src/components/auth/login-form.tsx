'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/actions/auth';
import { useToast } from '@/stores';
import { loginSchema, type LoginFormData } from '@/schemas/auth';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const result = await signIn(data);
      console.warn('Login result:', result);
      if (result?.errors) {
        if (result.errors.general) {
          showToast({
            type: 'error',
            title: 'Login Failed',
            message: result.errors.general,
          });
        }
      } else if (result?.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Successfully logged in!',
        });
        reset();
        
        // Force a full page navigation to ensure middleware picks up the session
        window.location.href = '/dashboard';
      }
    } catch(error) {
      console.warn(error);
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">      
      <div className="space-y-4">
        <div>
          <Input
            id="username"
            type="text"
            label="Username"
            className="mt-1"
            {...register('username')}
            error={errors.username?.message}
          />
        </div>
        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            className="mt-1"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

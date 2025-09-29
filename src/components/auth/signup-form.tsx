'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/actions/auth';
import { useToast } from '@/stores';
import { signupFormSchema, type SignupFormData } from '@/schemas/auth';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);
    try {
      const result = await signUp({
        full_name: data.full_name,
        user_name: data.username, // Map username to user_name
        email: data.email,
        password: data.password,
      });
      if (result?.errors) {
        if (result.errors.general) {
          showToast({
            type: 'error',
            title: 'Registration Failed',
            message: result.errors.general,
          });
        }
      } else if (result?.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Account created successfully! Please check your email for verification.',
        });
        reset();
        // Redirect to OTP verification page (email is stored securely server-side)
        window.location.href = '/auth/verify-otp';
      }
    } catch(error) {
      console.error(error);
      showToast({
        type: 'error',
        title: 'Registration Failed',
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
            id="full_name"
            type="text"
            label="Full Name"
            className="mt-1"
            {...register('full_name')}
            error={errors.full_name?.message}
          />
        </div>
        
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
            id="email"
            type="email"
            label="Email"
            className="mt-1"
            {...register('email')}
            error={errors.email?.message}
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
        
        <div>
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            className="mt-1"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

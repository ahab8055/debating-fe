'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/actions/auth';
import { useToast } from '@/stores';
import { signupFormSchema, type SignupFormData } from '@/schemas/auth';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  
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
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('user_name', data.user_name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const result = await signUp(formData);
      if (result?.errors) {
        if (result.errors.general) {
          showToast({
            type: 'error',
            title: 'Registration Failed',
            message: result.errors.general,
          });
        }
      } else {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Account created successfully! Please check your email for verification.',
        });
        reset();
        // Redirect to OTP verification page with email parameter
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
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
            id="user_name"
            type="text"
            label="Username"
            className="mt-1"
            {...register('user_name')}
            error={errors.user_name?.message}
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
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

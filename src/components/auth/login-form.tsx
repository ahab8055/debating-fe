'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            required
            label="Email"
            className="mt-1"
          />
        </div>
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            label="Password"
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

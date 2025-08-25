'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { useAuth } from '@/stores';

export function AuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not authenticated, redirect to login
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingPage />;
}

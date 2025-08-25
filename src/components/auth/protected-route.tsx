'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { useAuth } from '@/stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

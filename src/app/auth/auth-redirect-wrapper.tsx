'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { useAuth } from '@/stores';

export function AuthRedirectWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setHasChecked(true);
    };
    initAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (hasChecked && !isLoading && isAuthenticated) {
      // User is authenticated, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, hasChecked]);

  if (!hasChecked || isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

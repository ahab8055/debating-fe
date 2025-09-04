'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores';

export function useLogout() {
  const router = useRouter();
  const { logout: clearAuthStore } = useAuth();

  const logout = async () => {
    try {
      // Clear the auth store
      clearAuthStore();
      
      // Clear the session cookie by calling the API
      await fetch('/api/auth/session', { method: 'DELETE' });
      
      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear the store and redirect
      clearAuthStore();
      router.push('/auth/login');
    }
  };

  return logout;
}

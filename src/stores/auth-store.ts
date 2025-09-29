import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setUser: (user: User | null) => {
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            'setUser'
          );
        },

        setLoading: (loading: boolean) => {
          set(
            { isLoading: loading },
            false,
            'setLoading'
          );
        },

        checkAuthStatus: async () => {
          set({ isLoading: true }, false, 'checkAuthStatus/start');
          
          try {
            const user = await api.get<User>('/api/auth/me');
            
            set(
              {
                user,
                isAuthenticated: true,
                isLoading: false,
              },
              false,
              'checkAuthStatus/success'
            );
          } catch {
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              'checkAuthStatus/error'
            );
          }
        },

        logout: () => {
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'logout'
          );
        },
      }),
      {
        name: 'auth-store',
        // Only persist essential auth state, not loading states
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Convenient hook for auth status
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    checkAuthStatus,
    logout,
  };
};

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
}

interface AppActions {
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // Initial state
      isLoading: false,
      theme: 'system',
      sidebarOpen: false,

      // Actions
      setLoading: (loading: boolean) => {
        set(
          { isLoading: loading },
          false,
          'setLoading'
        );
      },

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set(
          { theme },
          false,
          'setTheme'
        );
      },

      toggleSidebar: () => {
        set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'toggleSidebar'
        );
      },

      setSidebarOpen: (open: boolean) => {
        set(
          { sidebarOpen: open },
          false,
          'setSidebarOpen'
        );
      },
    }),
    {
      name: 'app-store',
    }
  )
);

// Convenience hooks
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebar = () => ({
  isOpen: useAppStore((state) => state.sidebarOpen),
  toggle: useAppStore((state) => state.toggleSidebar),
  setOpen: useAppStore((state) => state.setSidebarOpen),
});

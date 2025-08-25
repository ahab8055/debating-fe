import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useToastStore = create<ToastStore>()(
  devtools(
    (set, get) => ({
      toasts: [],
      
      showToast: (toast: Omit<Toast, 'id'>) => {
        const id = generateId();
        const newToast: Toast = {
          id,
          duration: 5000,
          ...toast,
        };

        set(
          (state) => ({
            toasts: [...state.toasts, newToast],
          }),
          false,
          'showToast'
        );

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }
      },

      removeToast: (id: string) => {
        set(
          (state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          }),
          false,
          'removeToast'
        );
      },

      clearAllToasts: () => {
        set(
          { toasts: [] },
          false,
          'clearAllToasts'
        );
      },
    }),
    {
      name: 'toast-store',
    }
  )
);

// Custom hook for easier usage (maintains the same API as the context)
export const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const clearAllToasts = useToastStore((state) => state.clearAllToasts);
  
  return {
    showToast,
    removeToast,
    clearAllToasts,
  };
};

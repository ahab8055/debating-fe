import { ReactNode } from 'react';
import { AuthRedirectWrapper } from './auth-redirect-wrapper';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthRedirectWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthRedirectWrapper>
  );
}

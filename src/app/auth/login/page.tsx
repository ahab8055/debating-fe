import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-50">Sign in to continue debating</p>
      </div>
      <LoginForm />
    </div>
  );
}

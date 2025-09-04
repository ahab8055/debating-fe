import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Account</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-50">Join the debate community</p>
      </div>
      <SignupForm />
    </div>
  );
}

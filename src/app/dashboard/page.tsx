import { getCurrentUser, logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  console.log('Current user:', user);

  // If user is not found, show a loading state (this should be rare due to middleware redirect)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user.full_name || user.user_name || user.email}!
              </p>
            </div>
            <form action={logout}>
              <Button type="submit" className="border-gray-300 text-gray-200 hover:text-gray-700 hover:bg-gray-50">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to the Debating Platform
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your dashboard content will go here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

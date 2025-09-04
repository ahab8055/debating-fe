import { redirect } from 'next/navigation';
import { getSession } from '@/actions/auth';

export default async function Home() {
  const session = await getSession();
  
  if (session) {
    // User is authenticated, redirect to dashboard
    redirect('/dashboard');
  } else {
    // User is not authenticated, redirect to login
    redirect('/auth/login');
  }
}

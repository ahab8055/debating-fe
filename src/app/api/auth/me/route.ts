import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serverApi } from '@/lib/api';
import type { User } from '@/types/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    const user = await serverApi.get<User>('/auth/me', session);
    return NextResponse.json(user);
  } catch (error) {
    // Clear invalid session
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    const errorMessage = error instanceof Error ? error.message : 'Invalid session';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

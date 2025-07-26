'use server';

import { redirect } from 'next/navigation';

export async function logout() {
  //   await deleteSession()
  redirect('/auth/login');
}

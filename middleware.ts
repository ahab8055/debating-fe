import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/signup', 
    '/auth/forgot-password', 
    '/auth/reset-password', 
    '/auth/verify-otp',
    '/api'
  ];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access a protected route
  if (!session && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is authenticated and on root, redirect to dashboard
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and on root, redirect to login
  if (!session && pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

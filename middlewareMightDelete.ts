import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get all Appwrite session cookies
  const cookies = request.cookies.getAll();
  const hasSession = cookies.some(cookie => 
    cookie.name.startsWith('a_session_')
  );
  
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register');

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth pages with active session
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/register'],
};
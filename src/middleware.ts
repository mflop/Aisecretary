import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Check if we have a session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware auth error:', error);
      // If there's an error, consider the user not authenticated
    }

    // Check if the request is for the dashboard or auth routes
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                        req.nextUrl.pathname.startsWith('/register');
    const isMarketingRoute = req.nextUrl.pathname === '/' || 
                           req.nextUrl.pathname.startsWith('/#');

    // If accessing dashboard without session, redirect to login
    if (isDashboardRoute && !session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing auth routes with session, redirect to dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Add auth state to headers so components can access it
    if (session) {
      res.headers.set('x-auth-state', 'authenticated');
    } else {
      res.headers.set('x-auth-state', 'unauthenticated');
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // In case of an error, let the request proceed
    // but redirect to login if trying to access protected routes
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
    if (isDashboardRoute) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }
}

// Match all routes except static assets and api routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}; 
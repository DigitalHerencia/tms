import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes (no auth/RBAC required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/api/clerk/webhook-handler',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/services',
  '/privacy',
  '/terms',
  '/refund',
]);

/**
 * Middleware to protect routes and enforce authentication
 * - Public routes are accessible without auth
 * - All other routes require authentication
 */

export default clerkMiddleware(
  async (auth, req) => {
    // Protect all routes except public ones
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    // Security headers based on Clerk and Vercel analytics requirements
    const res = NextResponse.next();

    const csp = [
      "default-src 'self'",
      "script-src 'self' https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev https://vitals.vercel-insights.com",
      "connect-src 'self' https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev https://vitals.vercel-insights.com",
      "img-src 'self' data: https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev",
      "frame-src 'self' https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev",
    ].join('; ');

    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');

    return res;
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

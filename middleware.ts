import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { SystemRoles } from "@/types/abac"

// Public routes (no auth/RBAC required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/api/clerk/webhook-handler",
  "/about",
  "/contact",
  "/pricing",
  "/features",
  "/services",
  "/privacy",
  "/terms",
  "/refund",
])

/**
 * Middleware to protect routes and enforce authentication
 * - Public routes are accessible without auth
 * - All other routes require authentication
 */

export default clerkMiddleware(
  async (auth, req) => {
    // Protect all routes except public ones
    if (!isPublicRoute(req)) {
      await auth.protect()
    }

    // No role-based restriction for /settings route
    // All authenticated users can access settings
    // ...existing code...
  }
  // Remove CSP configuration to allow Clerk to work properly
  // We'll implement security headers in next.config.ts if needed
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

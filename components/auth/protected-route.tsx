'use client';

import type React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/components/auth/context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Type-safe props
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoaded, router, pathname]);

  if (!isLoaded) {
    // Loading state for auth context
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Unauthenticated: null render (redirect handled above)
    return null;
  }

  // Authenticated: render children
  return <>{children}</>;
}

import type React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';

interface MobileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

/**
 * Mobile Layout for Tenant Routes
 * Provides mobile-optimized layout for tenant pages
 */
export default async function MobileLayout({ children, params }: MobileLayoutProps) {
  const { orgId } = await params;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <main className="w-full p-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

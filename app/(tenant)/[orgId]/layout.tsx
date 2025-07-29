'use client';

import { TopNavBar } from '@/components/navigation/TopNavBar';
import { MainNav } from '@/components/navigation/MainNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserContext } from '@/components/auth/context';
import type React from 'react';
import { use, useState } from 'react';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string; userId: string }>;
}
/**
 * Client Component for Tenant Layout
 * Receives orgId from server component and uses auth context for userId
 */
export default function TenantLayout({ children, params }: TenantLayoutProps) {
  const { orgId, userId } = use(params);
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const user = useUserContext();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-700 bg-gray-800 shadow-lg">
          {/* Mobile header content can be added here */}
        </header>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header>
        <TopNavBar
          user={{
            name: user?.name || '',
            email: user?.email || '',
            profileImage: user?.profileImage || '',
          }}
          organization={{
            name: user?.organizationMetadata?.name || '',
          }}
        />
      </header>
      <MainNav orgId={orgId} userId={userId} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="mx-2">
        <main
          className={`transition-all duration-300 ease-in-out pt-16 ${
            collapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

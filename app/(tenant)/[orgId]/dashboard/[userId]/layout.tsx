import type { ReactNode } from "react";

// Next.js 15 async params pattern
interface DashboardUserLayoutProps {
  children: ReactNode;
  params: Promise<{
    orgId: string;
    userId: string;
  }>;
}

export default async function DashboardUserLayout({
  children,
  params,
}: DashboardUserLayoutProps) {
  const { orgId, userId } = await params;
  // You can use orgId and userId for context, fetchers, etc.

  return (
    // ...add wrappers, nav, etc. as needed...
    <>{children}</>
  );
}

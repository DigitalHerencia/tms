import { Suspense } from 'react';
import { OrganizationStats } from '@/components/dashboard/organization-stats';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { getDashboardMetrics, getOrganizationStats } from '@/lib/fetchers/dashboardFetchers';

export default async function AdminOverview({ orgId, userId }: { orgId: string; userId: string }) {
  const [metrics, stats] = await Promise.all([
    getDashboardMetrics(orgId, userId),
    getOrganizationStats(orgId),
  ]);

  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <OrganizationStats metrics={metrics} stats={stats} />
      </Suspense>
    </div>
  );
}

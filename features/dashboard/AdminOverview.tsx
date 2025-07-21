import { Suspense } from 'react';
import { OrganizationStats } from '@/components/dashboard/organization-stats';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

export default async function AdminOverview({ orgId, userId }: { orgId: string; userId: string }) {
  
  return (
    <div className="space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <OrganizationStats orgId={orgId} userId={userId} />
      </Suspense>
    </div>
  );
}

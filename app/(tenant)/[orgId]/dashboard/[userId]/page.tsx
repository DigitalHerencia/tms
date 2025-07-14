/**
 * Dashboard Page
 *
 * Main dashboard showing key metrics, recent activity, and quick actions
 */

import { Suspense } from 'react'
import FleetOverviewHeader from '@/components/dashboard/fleet-overview-header';
import { KPIGrid } from '@/components/dashboard/kpi-cards';
import QuickActionsWidget from '@/features/dashboard/quick-actions-widget';
import RecentAlertsWidget from '@/features/dashboard/recent-alerts-widget';
import TodaysScheduleWidget from '@/features/dashboard/todays-schedule-widget';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { getDashboardData } from '@/lib/fetchers/dashboardFetchers';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Fetch dashboard data for KPIs
  const dashboardData = await getDashboardData(orgId);

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Fleet Overview Header */}
      <Suspense fallback={<DashboardSkeleton />}>
        <FleetOverviewHeader orgId={orgId} />
      </Suspense>

      {/* Main Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<DashboardSkeleton />}>
          <QuickActionsWidget orgId={orgId} />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton />}>
          <RecentAlertsWidget orgId={orgId} />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton />}>
          <TodaysScheduleWidget orgId={orgId} />
        </Suspense>
      </div>

      {/* KPI Grid */}
      <div>
        <Suspense fallback={<DashboardSkeleton />}>
          <KPIGrid kpis={dashboardData.kpis} orgId={orgId} />
        </Suspense>
      </div>
    </div>
  );
}

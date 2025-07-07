/**
 * Dashboard Page
 *
 * Main dashboard showing key metrics, recent activity, and quick actions
 */

import { Suspense } from 'react'
import FleetOverviewHeader from '@/components/dashboard/fleet-overview-header';
import { KPIGrid } from '@/components/dashboard/kpi-cards';
import QuickActionsWidget from '@/components/dashboard/quick-actions-widget';
import RecentAlertsWidget from '@/components/dashboard/recent-alerts-widget';
import TodaysScheduleWidget from '@/components/dashboard/todays-schedule-widget';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { getDashboardData } from '@/lib/fetchers/dashboardFetchers';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orgId: string; userId?: string }>;
}) {
  const { orgId, userId } = await params;

  // Fetch dashboard data for KPIs
  const dashboardData = await getDashboardData(orgId);

  return (
    <div className="min-h-screen space-y-6 p-6 pt-8">
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
          <KPIGrid kpis={dashboardData.kpis} />
        </Suspense>
      </div>
    </div>
  );
}

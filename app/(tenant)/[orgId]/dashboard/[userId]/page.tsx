/**
 * Dashboard Page
 *
 * Main dashboard showing key metrics, recent activity, and quick actions
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import FleetOverviewHeader from '@/components/dashboard/fleet-overview-header';
import { KPIGrid } from '@/components/dashboard/kpi-cards';
import QuickActionsWidget from '@/features/dashboard/quick-actions-widget';
import RecentAlertsWidget from '@/features/dashboard/recent-alerts-widget';
import TodaysScheduleWidget from '@/features/dashboard/todays-schedule-widget';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { getDashboardData } from '@/lib/fetchers/dashboardFetchers';
import { getCurrentUser } from '@/lib/auth/auth';
import { Button } from '@/components/ui/button';
import { SystemRoles } from '@/types/abac';

interface DashboardPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { orgId, userId } = await params;
  
  // Get current user to check role
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: 'Unauthorized' };
  }

  // Fetch dashboard data for KPIs
  const dashboardData = await getDashboardData(orgId);

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Page Header with Admin Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Overview of your fleet operations</p>
        </div>
        {currentUser.role === SystemRoles.ADMIN && (
          <Button asChild variant="outline" className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700">
            <Link href={`/${orgId}/dashboard/${userId}/admin`} className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </Link>
          </Button>
        )}
      </div>

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

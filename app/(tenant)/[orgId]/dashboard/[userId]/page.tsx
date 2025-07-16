/**
 * Dashboard Page
 *
 * Main dashboard showing key metrics, recent activity, and quick actions
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { Activity, CreditCard, FileText, Shield, Users } from 'lucide-react'
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
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

      {/* Fleet Overview Header */}
      <Suspense fallback={<DashboardSkeleton />}>
        <FleetOverviewHeader orgId={orgId} userId={userId} />
      </Suspense>

  {/* Quick Stats Row */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Online</div>
              <p className="text-xs text-green-500">All systems operational</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Loading...</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Loading...</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Audit Events</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>
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

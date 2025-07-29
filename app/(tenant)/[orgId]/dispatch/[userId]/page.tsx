"use server";

import { Suspense } from "react";
import DispatchHeader from "@/components/dispatch/dispatch-header";
import { DispatchSkeleton } from "@/components/dispatch/dispatch-skeleton";
import { DispatchBoardFeature } from "@/features/dispatch/DispatchBoardFeature";
import { RecentActivityRow } from "@/components/dispatch/recent-activity";
import {
  getLoadsByOrg,
  getDriversByOrg,
  getVehiclesByOrg,
  getRecentDispatchActivity,
  getLoadSummaryStats,
} from "@/lib/fetchers/dispatchFetchers";
import { getCurrentUser } from "@/lib/auth/auth";

interface DispatchPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function DispatchPage({ params }: DispatchPageProps) {
  const { orgId, userId } = await params;

  // Fetch all required data in parallel
  const [loads, drivers, vehicles, recentActivity, summaryStats] = await Promise.all([
    getLoadsByOrg(orgId),
    getDriversByOrg(orgId),
    getVehiclesByOrg(orgId),
    getRecentDispatchActivity(orgId),
    getLoadSummaryStats(orgId),
  ]);

  // Check current user for auth
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-6 bg-neutral-900 min-h-screen">
        <span className="text-red-500 text-xl">Unauthorized access</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Header - Real-time status & connection */}
      <Suspense fallback={<DispatchSkeleton />}>
        <DispatchHeader orgId={orgId} />
      </Suspense>

      {/* Recent Activity & Quick Actions */}
      <RecentActivityRow
        params={{ userId }}
        stats={summaryStats}
        activities={recentActivity.data.map((activity) => ({
          ...activity,
          timestamp:
            activity.timestamp instanceof Date
              ? activity.timestamp.toISOString()
              : activity.timestamp,
        }))}
      />

      {/* Main Dispatch Board */}
      <Suspense fallback={<DispatchSkeleton />}>
        <DispatchBoardFeature
          orgId={orgId}
          loads={loads}
          drivers={drivers}
          vehicles={vehicles}
        />
      </Suspense>
    </div>
  );
}

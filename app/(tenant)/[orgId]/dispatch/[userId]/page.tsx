"use server";

import  { DispatchBoardFeature }  from "@/features/dispatch/DispatchBoardFeature";
import { getCurrentUser } from "@/lib/auth/auth";
import { Suspense } from "react";
import DispatchHeader from "@/components/dispatch/dispatch-header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { getLoadsByOrg, getDriversByOrg, getVehiclesByOrg, getRecentDispatchActivity, getLoadSummaryStats } from "@/lib/fetchers/dispatchFetchers";
import { RecentActivityRow } from "@/components/dispatch/recent-activity";

interface DispatchPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function DispatchPage({ params }: DispatchPageProps) {
  const { orgId, userId } = await params;

  // Fetch all required data
  const [loads, drivers, vehicles, RecentActivity, summaryStats] = await Promise.all([
    getLoadsByOrg(orgId),
    getDriversByOrg(orgId),
    getVehiclesByOrg(orgId),
    getRecentDispatchActivity(orgId),
    getLoadSummaryStats(orgId)
  ]);
   
  // Get current user to check role
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">Unauthorized access</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-6 bg-neutral-900 text-white min-h-screen">

      {/* Recent activity feed for dispatch operations */}
      <Suspense fallback={<LoadingSpinner/>}>
        <DispatchHeader orgId={ orgId } userId={ userId } />
      </Suspense>

      {/* Additional features can be added here */}
      <RecentActivityRow 
        stats={ summaryStats }
        params={{ userId }}
        RecentActivity={ RecentActivity.data.map(activity => ({
          ...activity,
          timestamp: activity.timestamp instanceof Date ? activity.timestamp.toISOString() : activity.timestamp
        })) }
      />
      
      {/* Main Dispatch Board */}
        <DispatchBoardFeature 
          orgId={ orgId }
          drivers={ drivers }
          loads={ loads }
          vehicles={ vehicles } 
        />      
  </div>
  );
}

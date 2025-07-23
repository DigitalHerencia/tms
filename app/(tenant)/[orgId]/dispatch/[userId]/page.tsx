import { DispatchSkeleton } from "@/components/dispatch/dispatch-skeleton";
import { RecentActivityRow } from "@/components/dispatch/recent-activity";
import  { DispatchBoardFeature }  from "@/features/dispatch/DispatchBoardFeature";
import { getCurrentUser } from "@/lib/auth/auth";
import { getOrganizationUsers } from "@/lib/fetchers/dashboardFetchers";
import { Suspense } from "react";
import DispatchHeader from "@/components/dispatch/dispatch-header";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

interface DispatchPageProps {
  params: Promise<{ orgId: string; userId: string }>;
  loads: any[];
  drivers: Driver[];
  vehicles: Vehicle[];
}

export default async function DispatchPage({ params, loads, drivers, vehicles }: DispatchPageProps) {
  const { orgId, userId } = await params;
   
  // Get current user to check role
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: 'Unauthorized' };
  }

  // Fetch users for the organization
  const users = await getOrganizationUsers(orgId);


  return (
    <div className="flex flex-col gap-3 p-6 bg-neutral-900 text-white min-h-screen">

      {/* Recent activity feed for dispatch operations */}
      <Suspense fallback={<LoadingSpinner/>}>
        <DispatchHeader orgId={ orgId } userId={ userId } />
      </Suspense>
      
      {/* Main Dispatch Board */}
      <DispatchBoardFeature 
        orgId={orgId} 
        drivers={drivers} 
        loads={loads} 
        vehicles={vehicles} 
      />
      {/* Recent activity feed for dispatch operations */}

      
      {/* Recent activity feed for dispatch operations */}
      <Suspense fallback={<DispatchSkeleton />}>
        <RecentActivityRow orgId={ orgId } onNewLoadClick={ function (): void
        {
          throw new Error( "Function not implemented." );
        } } onFilterClick={ function (): void
        {
          throw new Error( "Function not implemented." );
        } } summaryStats={ undefined } />
      </Suspense>
    </div>
  );
}

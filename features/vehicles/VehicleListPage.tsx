import { Suspense } from 'react';

import { listVehiclesByOrg } from '@/lib/fetchers/vehicleFetchers';
import VehicleListClient from '@/components/vehicles/vehicle-list-client';

interface VehicleListPageProps {
  orgId: string;
  page?: number;
}

/**
 * Server component showing the paginated vehicle list for an organization.
 *
 * @param props.orgId - Organization identifier used to fetch vehicles.
 * @param props.page - Optional page index, defaults to the first page.
 *
 * Layout adapts using flex utilities for mobile and desktop views.
 */
// See docs/screenshots/vehicle-list-page.png for example layout
export default async function VehicleListPage({
  orgId,
  page = 1,
}: VehicleListPageProps) {
  const { vehicles } = await listVehiclesByOrg(orgId, {
    page,
    limit: 50,
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Fleet Vehicles Header - see docs/screenshots/vehicles-header.png for spacing */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fleet Vehicles</h1>
          <p className="text-white/70">Manage your fleet vehicles and their information</p>
        </div>
      </div>
      
      <Suspense fallback={<div className="text-white/70">Loading vehicles...</div>}>
        <VehicleListClient orgId={orgId} initialVehicles={vehicles} />
      </Suspense>
    </div>
  );
}

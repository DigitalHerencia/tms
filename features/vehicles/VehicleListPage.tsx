import { Suspense } from 'react';

import { listVehiclesByOrg } from '@/lib/fetchers/vehicleFetchers';
import VehicleListClient from '@/components/vehicles/vehicle-list-client';

interface VehicleListPageProps {
  orgId: string;
  page?: number;
}

/**
 * Page displaying the fleet vehicle list.
 *
 * Vehicle cards stack vertically on small screens and expand in a grid on
 * desktop for easier browsing. /* See vehicles-grid.png */
 *
 * @param orgId - Organization identifier
 * @param page - Page number for vehicle pagination
 */

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

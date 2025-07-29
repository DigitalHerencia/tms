import { Suspense } from 'react';
import { listVehiclesByOrg } from '@/lib/fetchers/vehicleFetchers';
import { Plus, Truck } from 'lucide-react';
import Link from 'next/link';
import VehiclesClient from './vehicles-client';
import { VehicleListSkeleton } from '@/components/vehicles/vehicle-list-skeleton';

interface VehiclesPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function VehiclesPage({ params }: VehiclesPageProps) {
  const { orgId } = await params;
  const { data } = await listVehiclesByOrg(orgId);

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-row items-baseline justify-between mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-extrabold text-white">Fleet Vehicles</h1>
          </div>
          <p className="text-white/90 font-medium">
            Manage your fleet vehicles and their information
          </p>
        </div>
        <Link href={`/${orgId}/vehicles/new`}>
          <button className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        </Link>
      </div>

      <Suspense fallback={<VehicleListSkeleton />}>
        <VehiclesClient orgId={orgId} initialVehicles={data} />
      </Suspense>
    </div>
  );
}

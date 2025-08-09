import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getVehicleById } from '@/lib/fetchers/vehicleFetchers';
import VehicleDetailsClient from './vehicle-details-client';

interface VehicleDetailsPageProps {
  params: Promise<{ orgId: string; vehicleId: string }>;
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsPageProps) {
  const { orgId, vehicleId } = await params;

  try {
    const vehicle = await getVehicleById(orgId, vehicleId);

    if (!vehicle || vehicle.organizationId !== orgId) {
      notFound();
    }

    const serviceDue =
      vehicle.nextMaintenanceDate &&
      new Date(vehicle.nextMaintenanceDate) <= new Date();

    return (
      <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Vehicle Details - Unit #{vehicle.unitNumber}
            </h1>
            <p className="text-white/70">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </p>
          </div>
        </div>

        {serviceDue && (
          <div className="rounded-md border border-yellow-500 bg-yellow-500/10 p-4 text-yellow-200">
            Service is due for this vehicle.
          </div>
        )}

        <Suspense fallback={<div className="text-white/70">Loading vehicle details...</div>}>
          <VehicleDetailsClient orgId={orgId} vehicle={vehicle} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading vehicle:', error);
    notFound();
  }
}

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getVehicleById } from '@/lib/fetchers/vehicleFetchers';
import EditVehicleClient from './edit-vehicle-client';

interface EditVehiclePageProps {
  params: Promise<{ orgId: string; vehicleId: string }>;
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { orgId, vehicleId } = await params;

  try {
    const vehicle = await getVehicleById(orgId, vehicleId);

    if (!vehicle || vehicle.organizationId !== orgId) {
      notFound();
    }

    return (
      <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Edit Vehicle - Unit #{vehicle.unitNumber}
            </h1>
            <p className="text-white/70">
              Update the details for {vehicle.make} {vehicle.model} {vehicle.year}
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-white/70">Loading form...</div>}>
          <EditVehicleClient orgId={orgId} vehicle={vehicle} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading vehicle:', error);
    notFound();
  }
}

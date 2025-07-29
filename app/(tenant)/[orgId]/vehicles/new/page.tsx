import { Suspense } from 'react';
import NewVehicleClient from './new-vehicle-client';

interface NewVehiclePageProps {
  params: Promise<{ orgId: string }>;
}

export default async function NewVehiclePage({ params }: NewVehiclePageProps) {
  const { orgId } = await params;

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Add New Vehicle</h1>
          <p className="text-white/70">Enter the details for your new vehicle</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-white/70">Loading form...</div>}>
        <NewVehicleClient orgId={orgId} />
      </Suspense>
    </div>
  );
}

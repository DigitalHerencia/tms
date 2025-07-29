'use server';

import { getDriversByOrg, getVehiclesByOrg, getLoadById } from '@/lib/fetchers/dispatchFetchers';
import { EditLoadFeature } from '@/features/dispatch/EditLoadFeature';

interface EditLoadPageProps {
  params: { orgId: string; userId: string };
}

export default async function EditLoadPage({ params }: EditLoadPageProps) {
  const { orgId, userId } = params;
  const [drivers, vehicles, load] = await Promise.all([
    getDriversByOrg(orgId),
    getVehiclesByOrg(orgId),
    getLoadById(orgId, userId),
  ]);

  if (!load) {
    return (
      <div className="flex items-center justify-center p-6 bg-neutral-900 min-h-screen">
        <span className="text-red-500">Load not found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-neutral-900 text-white min-h-screen">
      <EditLoadFeature orgId={orgId} load={load} drivers={drivers} vehicles={vehicles} />
    </div>
  );
}

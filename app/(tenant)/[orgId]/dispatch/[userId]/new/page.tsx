"use server";

import { getDriversByOrg, getVehiclesByOrg } from "@/lib/fetchers/dispatchFetchers";
import { NewLoadFeature } from "@/features/dispatch/NewLoadFeature";

interface NewLoadPageProps {
  params: { orgId: string };
}

export default async function NewLoadPage({ params }: NewLoadPageProps) {
  const { orgId } = params;
  const [drivers, vehicles] = await Promise.all([
    getDriversByOrg(orgId),
    getVehiclesByOrg(orgId),
  ]);

  return (
    <div className="flex flex-col p-6 bg-neutral-900 text-white min-h-screen">
      <NewLoadFeature orgId={orgId} drivers={drivers} vehicles={vehicles} />
    </div>
  );
}

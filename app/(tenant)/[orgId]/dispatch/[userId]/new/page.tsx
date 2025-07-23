import { getDriversByOrg, getVehiclesByOrg } from "@/lib/fetchers/dispatchFetchers";
import { NewLoadFeature } from "@/features/dispatch/NewLoadFeature";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

interface NewLoadPageProps {
  params: {
    orgId: string;
  };
}

export default async function NewLoadPage({ params }: NewLoadPageProps) {
  const { orgId } = params;

  const drivers: Driver[] = await getDriversByOrg(orgId);
  const vehicles: Vehicle[] = await getVehiclesByOrg(orgId);

  return (
    <div className="container mx-auto py-8">
      <NewLoadFeature
        orgId={orgId}
        drivers={drivers}
        vehicles={vehicles}
      />
    </div>
  );
}

import { getDriversByOrg, getVehiclesByOrg, getLoadById } from "@/lib/fetchers/dispatchFetchers";
import { EditLoadFeature } from "@/features/dispatch/EditLoadFeature";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";
import type { Load } from "@/types/dispatch";

interface EditLoadPageProps {
  params: {
    orgId: string;
    loadId: string;
  };
}

export default async function EditLoadPage({ params }: EditLoadPageProps) {
  const { orgId, loadId } = params;

  // These must return Driver[] and Vehicle[] (with full fields!)
  const drivers: Driver[] = await getDriversByOrg(orgId);
  const vehicles: Vehicle[] = await getVehiclesByOrg(orgId);
  const load: Load | null = await getLoadById(orgId, loadId);

  if (!load) {
    return <div className="text-red-500 p-6">Load not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <EditLoadFeature
        orgId={orgId}
        load={load}
        drivers={drivers}
        vehicles={vehicles}
      />
    </div>
  );
}

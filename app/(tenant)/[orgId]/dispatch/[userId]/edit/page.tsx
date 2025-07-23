import { notFound } from "next/navigation";
import { LoadForm } from "@/components/dispatch/load-form";
import { getLoadById, getDriversByOrg, getVehiclesByOrg } from "@/lib/fetchers/dispatchFetchers";

interface EditLoadPageProps {
  params: { orgId: string; userId: string };
  searchParams: { loadId?: string };
}

export default async function EditLoadPage({ params, searchParams }: EditLoadPageProps) {
  const { orgId } = params;
  const loadId = searchParams.loadId;
  if (!loadId) {
    return notFound();
  }
  // Fetch the load to edit, and options for drivers/vehicles
  const [load, drivers, vehicles] = await Promise.all([
    getLoadById(orgId, loadId),
    getDriversByOrg(orgId),
    getVehiclesByOrg(orgId),
  ]);
  if (!load) {
    return notFound();
  }

  return (
    <div className="p-4">
      <LoadForm orgId={ orgId } load={ load } vehicles={ vehicles } drivers={ [] } />
    </div>
  );
}

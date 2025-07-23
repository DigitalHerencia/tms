import { notFound } from "next/navigation";
import { LoadForm } from "@/components/dispatch/load-form";
import { getDriversByOrg, getVehiclesByOrg } from "@/lib/fetchers/dispatchFetchers";

interface NewLoadPageProps {
  params: { orgId: string; userId: string };
}

export default async function NewLoadPage({ params }: NewLoadPageProps) {
  const { orgId, userId } = params;
  // Fetch drivers and vehicles for assignment options in the form
  const drivers = await getDriversByOrg(orgId);
  const vehicles = await getVehiclesByOrg(orgId);
  if (!drivers || !vehicles) {
    return notFound();
  }

  return (
    <div className="p-4">
      <LoadForm drivers={ [] } vehicles={ vehicles } orgId={ orgId } />
    </div>
  );
}

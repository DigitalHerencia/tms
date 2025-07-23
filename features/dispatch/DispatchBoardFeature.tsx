import { DispatchBoard } from "@/components/dispatch/dispatch-board";
import { getLoadsByOrg, getDriversByOrg, getVehiclesByOrg } from "@/lib/fetchers/dispatchFetchers";

interface DispatchBoardFeatureProps {
  orgId: string;
}

export default async function DispatchBoardFeature({ orgId }: DispatchBoardFeatureProps) {
  // Fetch all required data
  const loads = await getLoadsByOrg(orgId);
  const drivers = await getDriversByOrg(orgId);
  const vehicles = await getVehiclesByOrg(orgId);


  return (
    <DispatchBoard
      orgId={ orgId }
      loads={ loads }
      vehicles={ vehicles } 
      drivers={drivers}    />
  );
}

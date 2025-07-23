// features/dispatch/new-load-feature.tsx
import { LoadForm } from "@/components/dispatch/load-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

interface NewLoadFeatureProps {
  orgId: string;
  drivers: Driver[];
  vehicles: Vehicle[];
  onSuccess?: () => void;
}

export function NewLoadFeature({ orgId, drivers, vehicles, onSuccess }: NewLoadFeatureProps) {
  return (
    <Card className="mx-auto max-w-3xl mt-8 border border-gray-700 bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Create New Load</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadForm orgId={orgId} drivers={drivers} vehicles={vehicles} onClose={onSuccess} />
      </CardContent>
    </Card>
  );
}

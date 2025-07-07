import { LoadForm } from '@/components/dispatch/load-form';
import {
  getAvailableDriversForLoad,
  getAvailableVehiclesForLoad,
  getAvailableTrailersForLoad,
} from '@/lib/fetchers/dispatchFetchers';
import { getCurrentCompany } from '@/lib/auth/auth';

interface PageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function NewLoadPage({ params }: PageProps) {
  const { orgId } = await params;
  const company = await getCurrentCompany();
  if (!company) {
    return <div>Company not found. Please create a company first.</div>;
  }

  const [driversRes, vehiclesRes, trailersRes] = await Promise.all([
    getAvailableDriversForLoad(orgId),
    getAvailableVehiclesForLoad(orgId, {}),
    getAvailableTrailersForLoad(orgId, {}),
  ]);

  const drivers = driversRes?.data || [];
  const vehicles = [
    ...(vehiclesRes?.data || []),
    ...(trailersRes?.data || []),
  ];

  return (
    <div className="mt-6">
      <LoadForm drivers={drivers} vehicles={vehicles} />
    </div>
  );
}

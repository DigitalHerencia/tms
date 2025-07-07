import { notFound } from 'next/navigation';
import { LoadForm } from '@/components/dispatch/load-form';
import {
  getLoadDetails,
  getAvailableDriversForLoad,
  getAvailableVehiclesForLoad,
  getAvailableTrailersForLoad,
} from '@/lib/fetchers/dispatchFetchers';
import { getCurrentCompany } from '@/lib/auth/auth';

// Add index signature to allow string indexing
export type Dispatches = Record<
  string,
  {
    id: string;
    referenceNumber: string;
    status: string;
    customerName: string;
    customerContact: string;
    customerPhone: string;
    customerEmail: string;
    // ...other properties...
    trailerId: string;
  }
>;

interface PageProps {
  params: Promise<{ orgId: string; userId: string }>;
  searchParams: Promise<{ id?: string }>;
}

export default async function EditLoadPage({ params, searchParams }: PageProps) {
  const { orgId } = await params;
  const loadId = (await searchParams)?.id;

  const company = await getCurrentCompany();
  if (!company) {
    return <div>Company not found. Please create a company first.</div>;
  }

  if (!loadId) {
    return notFound();
  }

  const [load, driversRes, vehiclesRes, trailersRes] = await Promise.all([
    getLoadDetails(orgId, loadId),
    getAvailableDriversForLoad(orgId),
    getAvailableVehiclesForLoad(orgId, {}),
    getAvailableTrailersForLoad(orgId, {}),
  ]);
  if (!load) return notFound();

  const drivers = driversRes?.data || [];
  const vehicles = [
    ...(vehiclesRes?.data || []),
    ...(trailersRes?.data || []),
  ];

  // Transform the database load object to match LoadForm interface expectations
  const transformedLoad = {
    id: load.id,
    referenceNumber: load.referenceNumber || '',
    status: load.status,
    customerName: load.customerName || '',
    customerContact: load.customerContact || '',
    customerPhone: load.customerPhone || '',
    customerEmail: load.customerEmail || '',
    originAddress: load.originAddress,
    originCity: load.originCity,
    originState: load.originState,
    originZip: load.originZip,
    destinationAddress: load.destinationAddress,
    destinationCity: load.destinationCity,
    destinationState: load.destinationState,
    destinationZip: load.destinationZip,
    pickupDate: load.scheduledPickupDate?.toISOString().split('T')[0] || '',
    deliveryDate: load.scheduledDeliveryDate?.toISOString().split('T')[0] || '',
    commodity: load.commodity || '',
    weight: load.weight || 0,
    rate: Number(load.rate) || 0,
    miles: load.estimatedMiles || 0,
    notes: load.notes || '',
    driverId: load.driverId || '',
    vehicleId: load.vehicleId || '',
    trailerId: load.trailerId || '',
  };

  return (
    <div className="mt-6">
      <LoadForm drivers={drivers} vehicles={vehicles} load={transformedLoad} />
    </div>
  );
}

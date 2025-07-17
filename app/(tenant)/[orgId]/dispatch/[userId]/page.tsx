import type { LoadStatus, LoadPriority, LoadStatusEvent } from '@prisma/client';

import { DispatchBoard } from '@/components/dispatch/dispatch-board';
import {
  listLoadsByOrg,
  getAvailableDriversForLoad,
  getAvailableVehiclesForLoad,
} from '@/lib/fetchers/dispatchFetchers';
import type {
  Customer,
  LoadAssignedDriver,
  LoadAssignedVehicle,
  LoadAssignedTrailer,
  EquipmentRequirement,
  CargoDetails,
  Rate,
  LoadDocument,
  TrackingUpdate,
  BrokerInfo,
  LoadAlert,
} from '@/types/dispatch';

interface loadList {
  id: string;
  organizationId: string;
  referenceNumber: string;
  status: LoadStatus;
  priority: LoadPriority;
  customer: Customer;
  origin: string;
  destination: string;
  pickupDate: Date;
  deliveryDate: Date;
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  driver?: LoadAssignedDriver;
  vehicle?: LoadAssignedVehicle;
  trailer?: LoadAssignedTrailer;
  equipment?: EquipmentRequirement;
  cargo: CargoDetails;
  rate: Rate;
  miles?: number;
  estimatedMiles?: number;
  fuelCost?: number;
  notes?: string;
  internalNotes?: string;
  specialInstructions?: string;
  documents?: LoadDocument[];
  statusHistory?: LoadStatusEvent[];
  trackingUpdates?: TrackingUpdate[];
  brokerInfo?: BrokerInfo;
  alerts?: LoadAlert[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DispatchPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function DispatchPage({
  params,
}: DispatchPageProps) {
  const { orgId, userId } = await params;
  if (!orgId) {
    return <div className="p-8 text-red-400">Organization not found.</div>;
  }

  // Fetch all required data in parallel
  const [loads, driversResult, vehicles] = await Promise.all([
    listLoadsByOrg(orgId),
    getAvailableDriversForLoad(orgId),
    getAvailableVehiclesForLoad(orgId, {}),
  ]);
  const drivers = (driversResult?.data || []).map((d: any) => ({
    ...d,
    email: d.email ?? undefined,
  }));
  const loadsList: loadList[] = (loads?.data?.loads || []).map((l: any) => ({
    ...l,
    rate: l.rate
      ? {
          total: l.rate.total && typeof l.rate.total.toNumber === 'function' ? l.rate.total.toNumber() : l.rate.total,
          currency: l.rate.currency,
          type: l.rate.type,
          lineHaul: l.rate.lineHaul && typeof l.rate.lineHaul.toNumber === 'function' ? l.rate.lineHaul.toNumber() : l.rate.lineHaul,
          fuelSurcharge: l.rate.fuelSurcharge && typeof l.rate.fuelSurcharge.toNumber === 'function' ? l.rate.fuelSurcharge.toNumber() : l.rate.fuelSurcharge,
          detention: l.rate.detention && typeof l.rate.detention.toNumber === 'function' ? l.rate.detention.toNumber() : l.rate.detention,
          layover: l.rate.layover && typeof l.rate.layover.toNumber === 'function' ? l.rate.layover.toNumber() : l.rate.layover,
          loading: l.rate.loading && typeof l.rate.loading.toNumber === 'function' ? l.rate.loading.toNumber() : l.rate.loading,
          unloading: l.rate.unloading && typeof l.rate.unloading.toNumber === 'function' ? l.rate.unloading.toNumber() : l.rate.unloading,
          additionalStops: l.rate.additionalStops && typeof l.rate.additionalStops.toNumber === 'function' ? l.rate.additionalStops.toNumber() : l.rate.additionalStops,
          deadhead: l.rate.deadhead && typeof l.rate.deadhead.toNumber === 'function' ? l.rate.deadhead.toNumber() : l.rate.deadhead,
          permits: l.rate.permits && typeof l.rate.permits.toNumber === 'function' ? l.rate.permits.toNumber() : l.rate.permits,
          tolls: l.rate.tolls && typeof l.rate.tolls.toNumber === 'function' ? l.rate.tolls.toNumber() : l.rate.tolls,
          other: l.rate.other && typeof l.rate.other.toNumber === 'function' ? l.rate.other.toNumber() : l.rate.other,
          otherDescription: l.rate.otherDescription,
          advancePay: l.rate.advancePay && typeof l.rate.advancePay.toNumber === 'function' ? l.rate.advancePay.toNumber() : l.rate.advancePay,
          brokerageRate: l.rate.brokerageRate && typeof l.rate.brokerageRate.toNumber === 'function' ? l.rate.brokerageRate.toNumber() : l.rate.brokerageRate,
          commissionRate: l.rate.commissionRate && typeof l.rate.commissionRate.toNumber === 'function' ? l.rate.commissionRate.toNumber() : l.rate.commissionRate,
          driverPay: l.rate.driverPay && typeof l.rate.driverPay.toNumber === 'function' ? l.rate.driverPay.toNumber() : l.rate.driverPay,
          driverPayType: l.rate.driverPayType,
          profit: l.rate.profit && typeof l.rate.profit.toNumber === 'function' ? l.rate.profit.toNumber() : l.rate.profit,
          profitMargin: l.rate.profitMargin && typeof l.rate.profitMargin.toNumber === 'function' ? l.rate.profitMargin.toNumber() : l.rate.profitMargin,
          notes: l.rate.notes,
        }
      : undefined,
    origin: l.origin && typeof l.origin === 'object' ? {
      ...l.origin,
      lat: l.origin.lat && typeof l.origin.lat?.toNumber === 'function' ? l.origin.lat.toNumber() : l.origin.lat,
      lng: l.origin.lng && typeof l.origin.lng?.toNumber === 'function' ? l.origin.lng.toNumber() : l.origin.lng,
    } : l.origin,
    destination: l.destination && typeof l.destination === 'object' ? {
      ...l.destination,
      lat: l.destination.lat && typeof l.destination.lat?.toNumber === 'function' ? l.destination.lat.toNumber() : l.destination.lat,
      lng: l.destination.lng && typeof l.destination.lng?.toNumber === 'function' ? l.destination.lng.toNumber() : l.destination.lng,
    } : l.destination,
    miles: l.miles && typeof l.miles?.toNumber === 'function' ? l.miles.toNumber() : l.miles,
    estimatedMiles: l.estimatedMiles && typeof l.estimatedMiles?.toNumber === 'function' ? l.estimatedMiles.toNumber() : l.estimatedMiles,
    fuelCost: l.fuelCost && typeof l.fuelCost?.toNumber === 'function' ? l.fuelCost.toNumber() : l.fuelCost,
    originLat: l.originLat && typeof l.originLat?.toNumber === 'function' ? l.originLat.toNumber() : l.originLat,
    originLng: l.originLng && typeof l.originLng?.toNumber === 'function' ? l.originLng.toNumber() : l.originLng,
    destinationLat: l.destinationLat && typeof l.destinationLat?.toNumber === 'function' ? l.destinationLat.toNumber() : l.destinationLat,
    destinationLng: l.destinationLng && typeof l.destinationLng?.toNumber === 'function' ? l.destinationLng.toNumber() : l.destinationLng,
    actualMiles: l.actualMiles && typeof l.actualMiles?.toNumber === 'function' ? l.actualMiles.toNumber() : l.actualMiles,
  }));
  const vehicleList = vehicles?.data || [];

  return (
    <div className="min-h-screen bg-neutral-900 p-4 md:p-6 lg:p-8">
      <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-white">Dispatch Board</h1>
          <p className="text-sm text-gray-400">
            Manage, assign, and track loads in real time
          </p>
        </div>
        {/* Add quick actions or filters here if needed */}
      </div>      <div className="w-full">
        <DispatchBoard
          loads={loadsList}
          drivers={drivers}
          vehicles={vehicleList}
          orgId={orgId}
        />
      </div>
    </div>
  );
}
  
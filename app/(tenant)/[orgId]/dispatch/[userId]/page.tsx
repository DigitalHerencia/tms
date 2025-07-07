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
  FactoringInfo,
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
  factoring?: FactoringInfo;
  alerts?: LoadAlert[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function DispatchPage({
  params,
}: {
  params: Promise<{ orgId: string; userId?: string }>;
}) {
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
    id: l.id,
    organizationId: l.organizationId,
    referenceNumber: l.referenceNumber,
    status: l.status,
    priority: l.priority,
    customer: l.customer,
    origin: l.origin,
    destination: l.destination,
    pickupDate: l.pickupDate,
    deliveryDate: l.deliveryDate,
    estimatedPickupTime: l.estimatedPickupTime,
    estimatedDeliveryTime: l.estimatedDeliveryTime,
    actualPickupTime: l.actualPickupTime,
    actualDeliveryTime: l.actualDeliveryTime,
    driver: l.driver,
    vehicle: l.vehicle,
    trailer: l.trailer,
    equipment: l.equipment,
    cargo: l.cargo,
    rate: l.rate,
    miles: l.miles,
    estimatedMiles: l.estimatedMiles,
    fuelCost: l.fuelCost,
    notes: l.notes,
    internalNotes: l.internalNotes,
    specialInstructions: l.specialInstructions,
    documents: l.documents,
    statusHistory: l.statusHistory,
    trackingUpdates: l.trackingUpdates,
    brokerInfo: l.brokerInfo,
    factoring: l.factoring,
    alerts: l.alerts,
    tags: l.tags,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));
  const vehicleList = vehicles?.data || [];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8">
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


"use client";

import { use } from "react";
import { DispatchBoard } from "@/components/dispatch/dispatch-board";
import {
  listLoadsByOrg,
  getAvailableDriversForLoad,
  getAvailableVehiclesForLoad,
} from "@/lib/fetchers/dispatchFetchers";
import type { AssignmentMeta } from "@/types/dispatch";
import type {
  CargoDetails,
  Customer,
  EquipmentRequirement,
  LoadAlert,
  LoadAssignedDriver,
  LoadAssignedTrailer,
  LoadAssignedVehicle,
  LoadDocument,
  Rate,
  TrackingUpdate,
  BrokerInfo,
} from "@/types/dispatch";
import type {
  LoadPriority,
  LoadStatus,
  LoadStatusEvent,
} from "@prisma/client";
import type { $Enums } from "@prisma/client";

/**
 * Business‑logic wrapper that gathers all required data for the board.
 * This component **must** be a Client Component because it calls `use()`
 * on server promises.
 */
interface DispatchBoardFeatureProps {
  orgId: string;
  userId: string;
}

// ——— Runtime load / driver / vehicle types ———
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  status: $Enums.VehicleStatus;
  id: string;
  type: string;
  make: string | null;
  model: string | null;
  year: number | null;
  unitNumber: string;
  currentOdometer: number | null;
  lastInspectionDate: Date | null;
  nextInspectionDue: Date | null;
}

interface Load {
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
  meta?: AssignmentMeta;
  lastModifiedBy?: string;
  statusEvents?: LoadStatusEvent[];
}

export function DispatchBoardFeature({ orgId }: DispatchBoardFeatureProps) {
  // ---------- Data fetching (runs on server) ----------
  // Using the experimental `use()` hook to unwrap server promises inside a
  // Client Component. Keeps UI pure while feature handles the fetching.
  const [loadsRes, driversRes, vehiclesRes] = use(Promise.all([
    listLoadsByOrg(orgId),
    getAvailableDriversForLoad(orgId),
    getAvailableVehiclesForLoad(orgId, {}),
  ]));

  // Normalise driver e‑mails (API may return null)
  const drivers: Driver[] = (driversRes?.data || []).map((d: any) => ({
    ...d,
    email: d.email ?? undefined,
  }));

  // Ensure number coercion & other transformations for loads — keep it minimal
  const loads: Load[] = ( loadsRes?.data?.loads || [] ) as unknown as Load[];

  const vehicles: Vehicle[] = (vehiclesRes?.data || []) as Vehicle[];

  return (
    <DispatchBoard
      loads={loads}
      drivers={drivers}
      vehicles={vehicles}
      orgId={orgId}
    />
  );
}
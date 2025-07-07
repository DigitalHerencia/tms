'use client';

import { MapPin, Calendar, User, Truck } from 'lucide-react';
import type { LoadStatus, LoadPriority, LoadStatusEvent } from '@prisma/client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/utils';
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
  factoring?: FactoringInfo;
  alerts?: LoadAlert[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  statusEvents?: LoadStatusEvent[];
}

interface LoadCardProps {
  load: Load;
  onClick: () => void;
  onStatusUpdate?: (loadId: string, status: string) => void;
  isUpdating?: boolean;
}

export function LoadCard({
  load,
  onClick,
  onStatusUpdate,
  isUpdating,
}: LoadCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-500 text-white';
      case 'in_transit':
        return 'bg-yellow-500 text-black';
      case 'delivered':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned':
        return ['in_transit', 'cancelled'];
      case 'in_transit':
        return ['delivered', 'cancelled'];
      case 'delivered':
        return [];
      default:
        return ['assigned'];
    }
  };

  const nextStatusOptions = getNextStatusOptions(load.status);

  const handleStatusClick = (e: React.MouseEvent, status: string) => {
    e.stopPropagation();
    if (onStatusUpdate) onStatusUpdate(load.id, status);
  };

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{load.referenceNumber}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(load.status)}>
              {load.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {/* Display customer name or fallback to "Unknown Customer" */}
          {load.customer.name ?? 'Unknown Customer'}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Origin</p>
              <p className="text-muted-foreground text-sm">
                {load.origin}, {load.origin}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Destination</p>
              <p className="text-muted-foreground text-sm">
                {load.destination}, {load.destination}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-muted-foreground text-sm">
                {formatDate(load.pickupDate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="w-full space-y-1">
          {load.driver ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs">Driver:</span>
              </div>
              <span className="text-xs font-medium">{load.driver.name}</span>
            </div>
          ) : null}
          {load.vehicle ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Truck className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs">Vehicle:</span>
              </div>
              <span className="text-xs font-medium">{load.vehicle.unit}</span>
            </div>
          ) : null}
        </div>
      </CardFooter>
      {nextStatusOptions.length > 0 && (
        <div className="mt-2 flex gap-2">
          {nextStatusOptions.map(status => (
            <Button
              key={status}
              size="sm"
              variant="secondary"
              className="px-3 py-1 text-xs"
              disabled={isUpdating}
              onClick={e => handleStatusClick(e, status)}
            >
              {isUpdating
                ? 'Updating...'
                : `Mark as ${status.replace(/_/g, ' ')}`}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

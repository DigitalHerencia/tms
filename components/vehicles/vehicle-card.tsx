'use client';

import { Truck, Calendar, Gauge, AlertTriangle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/utils';

interface Vehicle {
  id: string;
  unitNumber?: string;
  type: string;
  status: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
  state?: string;
  currentOdometer?: number;
  lastOdometerUpdate?: Date;
  maintenanceRecords?: {
    id: string;
    type: string;
    status: string;
    description: string;
    scheduledDate?: Date;
  }[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Truck className="text-muted-foreground h-4 w-4" />;
  };

  const upcomingMaintenance = vehicle.maintenanceRecords?.find(
    record => record.status === 'scheduled' && record.scheduledDate
  );

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(vehicle.type)}
            <h3 className="font-medium">
              {vehicle.unitNumber || 'No Unit Number'}
            </h3>
          </div>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {vehicle.vin && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">VIN:</span>
              <span className="font-mono">{vehicle.vin}</span>
            </div>
          )}
          {vehicle.licensePlate && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">License:</span>
              <span>
                {vehicle.licensePlate} ({vehicle.state})
              </span>
            </div>
          )}
          {vehicle.currentOdometer && (
            <div className="flex items-center gap-2">
              <Gauge className="text-muted-foreground h-4 w-4" />
              <span>
                {vehicle.currentOdometer.toLocaleString()} miles
                {vehicle.lastOdometerUpdate && (
                  <span className="text-muted-foreground ml-1 text-xs">
                    (as of {formatDate(vehicle.lastOdometerUpdate)})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        {upcomingMaintenance ? (
          <div className="flex w-full items-center gap-2 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
            <span className="text-yellow-700">
              Maintenance scheduled:{' '}
              {formatDate(upcomingMaintenance.scheduledDate!)}
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground flex w-full items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>No upcoming maintenance</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

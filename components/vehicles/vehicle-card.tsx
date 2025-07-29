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
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Truck className="h-4 w-4 text-blue-400" />;
  };

  const upcomingMaintenance = vehicle.maintenanceRecords?.find(
    record => record.status === 'scheduled' && record.scheduledDate
  );

  return (
    <Card
      className="border-border rounded-md border bg-card hover:border-blue-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(vehicle.type)}
            <h3 className="font-medium text-card-foreground">
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
            <div className="flex items-center gap-2 text-foreground/90">
              <span className="text-muted-foreground">VIN:</span>
              <span className="font-mono text-card-foreground">{vehicle.vin}</span>
            </div>
          )}
          {vehicle.licensePlate && (
            <div className="flex items-center gap-2 text-foreground/90">
              <span className="text-muted-foreground">License:</span>
              <span className="text-card-foreground">
                {vehicle.licensePlate} ({vehicle.state})
              </span>
            </div>
          )}
          {vehicle.currentOdometer && (
            <div className="flex items-center gap-2 text-foreground/90">
              <Gauge className="h-4 w-4 text-blue-400" />
              <span className="text-card-foreground">
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
      <CardFooter className="border-t border-border/10 pt-3">
        {upcomingMaintenance ? (
          <div className="flex w-full items-center gap-2 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-yellow-400">
              Maintenance scheduled:{' '}
              {formatDate(upcomingMaintenance.scheduledDate!)}
            </span>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>No upcoming maintenance</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

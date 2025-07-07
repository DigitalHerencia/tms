'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Truck,
  Gauge,
  FileText,
  PenToolIcon as Tool,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatDate, formatCurrency } from '@/lib/utils/utils';
import { updateVehicleStatusAction } from '@/lib/actions/vehicleActions';
import { useToast } from '@/hooks/use-toast';
import type { VehicleStatus, Vehicle } from '@/types/vehicles';

interface MaintenanceRecord {
  id: string;
  type: string;
  status: string;
  description: string;
  odometer?: number;
  cost?: number;
  vendor?: string;
  completedDate?: Date;
  scheduledDate?: Date;
  notes?: string;
}

interface Inspection {
  id: string;
  type: string;
  status: string;
  date: Date;
  location?: string;
  notes?: string;
  defects?: any[];
}

interface Load {
  id: string;
  referenceNumber: string;
  status: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: Date;
  deliveryDate: Date;
  driver?: {
    firstName: string;
    lastName: string;
  };
}

interface VehicleDetailsDialogProps {
  vehicle: Vehicle;
  maintenanceRecords?: MaintenanceRecord[];
  inspections?: Inspection[];
  recentLoads?: Load[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleUpdate?: (vehicle: Vehicle) => void;
}

export function VehicleDetailsDialog({
  vehicle,
  maintenanceRecords = [],
  inspections = [],
  recentLoads = [],
  open,
  onOpenChange,
  onVehicleUpdate,
}: VehicleDetailsDialogProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInspectionStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    setError(null);
    startTransition(async () => {
      try {
        // Map UI status to VehicleStatus enum
        let status: VehicleStatus;
        switch (newStatus) {
          case 'active':
            status = 'available';
            break;
          case 'maintenance':
            status = 'in_maintenance';
            break;
          case 'inactive':
            status = 'out_of_service';
            break;
          case 'assigned':
            status = 'assigned';
            break;
          case 'retired':
            status = 'retired';
            break;
          default:
            status = 'available';
        }
        const result = await updateVehicleStatusAction(vehicle.id, { status });
        setIsUpdatingStatus(false);
        if (result.success && result.data) {
          // Defensive: result.data can be Vehicle or Vehicle[]
          const updated = Array.isArray(result.data) ? result.data[0] : result.data;
          if (onVehicleUpdate) onVehicleUpdate(updated);
          toast({ title: 'Status Updated', description: `Vehicle status changed to ${status.replace('_', ' ')}` });
          onOpenChange(false);
        } else {
          setError(result.error || 'Failed to update vehicle status');
          toast({ title: 'Error', description: result.error || 'Failed to update vehicle status', variant: 'destructive' });
        }
      } catch (err) {
        setIsUpdatingStatus(false);
        setError('An unexpected error occurred');
        toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
      }
    });
  };

  const upcomingMaintenance = maintenanceRecords.filter(
    (record: MaintenanceRecord) => record.status === 'scheduled' && record.scheduledDate
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Vehicle Details - Unit #{vehicle.unitNumber || 'N/A'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="loads">Recent Loads</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <div className="font-medium capitalize">
                          {vehicle.type}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Status</Label>
                        <div>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">VIN</Label>
                      <div className="font-mono font-medium">
                        {vehicle.vin || 'N/A'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">License Plate</Label>
                        <div className="font-medium">
                          {vehicle.licensePlate || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">State</Label>
                        <div className="font-medium">
                          {vehicle.licensePlateState || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="flex items-center gap-1 text-xs">
                        <Gauge className="h-3 w-3" /> Total Mileage
                      </Label>
                      <div className="font-medium">
                        {vehicle.totalMileage
                          ? `${vehicle.totalMileage.toLocaleString()} miles`
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Last Maintenance Mileage</Label>
                      <div className="font-medium">
                        {vehicle.lastMaintenanceMileage
                          ? `${vehicle.lastMaintenanceMileage.toLocaleString()} miles`
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Fuel Type</Label>
                      <div className="font-medium capitalize">
                        {vehicle.fuelType || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {upcomingMaintenance.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      Upcoming Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {upcomingMaintenance.map((record: MaintenanceRecord) => (
                        <div
                          key={record.id}
                          className="flex items-start gap-2 rounded-md border p-2"
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                          <div>
                            <div className="font-medium">
                              {record.description}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Scheduled:{' '}
                              {record.scheduledDate
                                ? formatDate(record.scheduledDate)
                                : 'N/A'}
                            </div>
                            {record.notes && (
                              <div className="mt-1 text-sm">{record.notes}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Records</CardTitle>
                <CardDescription>
                  View and manage maintenance for this vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Schedule Maintenance</h4>
                    <p className="text-muted-foreground text-sm">
                      Add a new maintenance record
                    </p>
                  </div>
                  <Button variant="outline">
                    <Tool className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>

                {maintenanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRecords.map((record: MaintenanceRecord) => (
                      <div key={record.id} className="rounded-md border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {record.description}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {record.type.charAt(0).toUpperCase() +
                                record.type.slice(1)}{' '}
                              maintenance
                            </div>
                          </div>
                          <Badge
                            className={getMaintenanceStatusColor(record.status)}
                          >
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Date:{' '}
                            </span>
                            <span>
                              {record.completedDate
                                ? formatDate(record.completedDate)
                                : record.scheduledDate
                                  ? formatDate(record.scheduledDate)
                                  : 'N/A'}
                            </span>
                          </div>
                          {record.odometer && (
                            <div>
                              <span className="text-muted-foreground">
                                Odometer:{' '}
                              </span>
                              <span>
                                {record.odometer.toLocaleString()} miles
                              </span>
                            </div>
                          )}
                          {record.cost && (
                            <div>
                              <span className="text-muted-foreground">
                                Cost:{' '}
                              </span>
                              <span>{formatCurrency(record.cost)}</span>
                            </div>
                          )}
                          {record.vendor && (
                            <div>
                              <span className="text-muted-foreground">
                                Vendor:{' '}
                              </span>
                              <span>{record.vendor}</span>
                            </div>
                          )}
                        </div>
                        {record.notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Notes:{' '}
                            </span>
                            <span>{record.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <Tool className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No maintenance records found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Records</CardTitle>
                <CardDescription>
                  View and manage inspections for this vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Record Inspection</h4>
                    <p className="text-muted-foreground text-sm">
                      Add a new inspection record
                    </p>
                  </div>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Add Inspection
                  </Button>
                </div>

                {inspections.length > 0 ? (
                  <div className="space-y-4">
                    {inspections.map((inspection: Inspection) => (
                      <div
                        key={inspection.id}
                        className="rounded-md border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {inspection.type.charAt(0).toUpperCase() +
                                inspection.type.slice(1)}{' '}
                              Inspection
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {formatDate(inspection.date)}
                            </div>
                          </div>
                          <Badge
                            className={getInspectionStatusColor(
                              inspection.status
                            )}
                          >
                            {inspection.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {inspection.location && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <MapPin className="text-muted-foreground h-4 w-4" />
                            <span>{inspection.location}</span>
                          </div>
                        )}
                        {inspection.notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Notes:{' '}
                            </span>
                            <span>{inspection.notes}</span>
                          </div>
                        )}
                        {inspection.defects &&
                          inspection.defects.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium">
                                Defects:
                              </div>
                              <ul className="mt-1 list-inside list-disc text-sm">
                                {inspection.defects.map(
                                  (defect: any, index: number) => (
                                    <li key={index}>
                                      {defect.component}: {defect.description} (
                                      {defect.severity} severity)
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No inspection records found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loads" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Loads</CardTitle>
                <CardDescription>
                  Recent and upcoming loads assigned to this vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLoads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLoads.map((load: Load) => (
                      <div key={load.id} className="rounded-md border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {load.referenceNumber}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {formatDate(load.pickupDate)} -{' '}
                              {formatDate(load.deliveryDate)}
                            </div>
                          </div>
                          <Badge className={getLoadStatusColor(load.status)}>
                            {load.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <MapPin className="text-muted-foreground h-4 w-4" />
                          <span>
                            {load.originCity}, {load.originState} to{' '}
                            {load.destinationCity}, {load.destinationState}
                          </span>
                        </div>
                        {load.driver && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Driver:{' '}
                            </span>
                            <span>
                              {load.driver.firstName} {load.driver.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <Truck className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No recent loads found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 rounded-md bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/vehicles/${vehicle.id}/edit`}>Edit Vehicle</Link>
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          <div className="flex gap-2">
            {vehicle.status === 'available' && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('maintenance')}
                disabled={isUpdatingStatus}
              >
                Mark for Maintenance
              </Button>
            )}
            {vehicle.status === 'in_maintenance' && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('active')}
                disabled={isUpdatingStatus}
              >
                Mark as Active
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
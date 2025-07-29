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
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'out_of_service':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'retired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'scheduled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getInspectionStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_transit':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
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
      <DialogContent className="max-h-screen max-w-4xl overflow-y-auto bg-background border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Truck className="h-5 w-5 text-blue-400" />
            Vehicle Details - Unit #{vehicle.unitNumber || 'N/A'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-card border-border">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-card-foreground text-muted-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-card-foreground text-muted-foreground"
            >
              Maintenance
            </TabsTrigger>
            <TabsTrigger 
              value="inspections"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-card-foreground text-muted-foreground"
            >
              Inspections
            </TabsTrigger>
            <TabsTrigger 
              value="loads"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-card-foreground text-muted-foreground"
            >
              Recent Loads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-card-foreground">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <div className="font-medium capitalize text-card-foreground">
                          {vehicle.type}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <div>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">VIN</Label>
                      <div className="font-mono font-medium text-card-foreground">
                        {vehicle.vin || 'N/A'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">License Plate</Label>
                        <div className="font-medium text-card-foreground">
                          {vehicle.licensePlate || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">State</Label>
                        <div className="font-medium text-card-foreground">
                          {vehicle.licensePlateState || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-card-foreground">Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Gauge className="h-3 w-3 text-blue-400" /> Total Mileage
                      </Label>
                      <div className="font-medium text-card-foreground">
                        {vehicle.totalMileage
                          ? `${vehicle.totalMileage.toLocaleString()} miles`
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Maintenance Mileage</Label>
                      <div className="font-medium text-card-foreground">
                        {vehicle.lastMaintenanceMileage
                          ? `${vehicle.lastMaintenanceMileage.toLocaleString()} miles`
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fuel Type</Label>
                      <div className="font-medium capitalize text-card-foreground">
                        {vehicle.fuelType || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {upcomingMaintenance.length > 0 && (
                <Card className="md:col-span-2 bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-card-foreground">
                      Upcoming Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {upcomingMaintenance.map((record: MaintenanceRecord) => (
                        <div
                          key={record.id}
                          className="flex items-start gap-2 rounded-md border border-border/10 p-2 bg-card"
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-400" />
                          <div>
                            <div className="font-medium text-card-foreground">
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
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Maintenance Records</CardTitle>
                <CardDescription className="text-muted-foreground">
                  View and manage maintenance for this vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-card-foreground">Schedule Maintenance</h4>
                    <p className="text-muted-foreground text-sm">
                      Add a new maintenance record
                    </p>
                  </div>
                  <Button 
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
                  >
                    <Tool className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>

                {maintenanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRecords.map((record: MaintenanceRecord) => (
                      <div key={record.id} className="rounded-md border border-border/10 p-4 bg-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-card-foreground">
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
                            <span className="text-card-foreground">
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
            <Card className="bg-card border-border">
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
                  <Button 
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
                  >
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
            <Card className="bg-card border-border">
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
          <div className="mt-4 rounded-md bg-red-500/20 border border-red-500/30 p-4 text-red-400">
            {error}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              asChild
              className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
            >
              <Link href={`/vehicles/${vehicle.id}/edit`}>Edit Vehicle</Link>
            </Button>
            <Button 
              onClick={() => onOpenChange(false)}
              className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
            >
              Close
            </Button>
          </div>
          <div className="flex gap-2">
            {vehicle.status === 'available' && (
              <Button
                onClick={() => handleStatusUpdate('maintenance')}
                disabled={isUpdatingStatus}
                className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
              >
                Mark for Maintenance
              </Button>
            )}
            {vehicle.status === 'in_maintenance' && (
              <Button
                onClick={() => handleStatusUpdate('active')}
                disabled={isUpdatingStatus}
                className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-card-foreground hover:bg-blue-800"
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
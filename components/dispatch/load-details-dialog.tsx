'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Route, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateDispatchLoadAction } from '@/lib/actions/dispatchActions';
import { LoadDocuments } from './load-documents';
import type { Driver } from '@/types/drivers';
import type { Load } from '@/types/dispatch';
import type { Vehicle } from '@/types/vehicles';
import { Button } from '../ui/button';

interface LoadDetailsDialogProps {
  orgid: string;
  load: Load;
  drivers: Driver[];
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
}

export function LoadDetailsDialog({
  load,
  drivers,
  vehicles,
  isOpen,
  onClose,
}: LoadDetailsDialogProps) {
  const router = useRouter();
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedTrailerId, setSelectedTrailerId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const orgId = load.organizationId;
  const loadId = load.id;

  const getStatusBadgeColor = (status: string) => {
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

  const activeTractors = vehicles.filter((v) => v.type === 'tractor');
  const activeTrailers = vehicles.filter((v) => v.type === 'trailer');
  const activeDrivers = drivers.filter((d) => d.status !== 'inactive');

  const handleAssign = async () => {
    setIsAssigning(true);
    try {
      const formData = new FormData();
      formData.set('driver_id', selectedDriverId || '');
      formData.set('vehicle_id', selectedVehicleId || '');
      formData.set('trailer_id', selectedTrailerId || '');
      await updateDispatchLoadAction(orgId, loadId, formData);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error assigning driver/vehicle:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  async function handleStatusUpdate(newStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const formData = new FormData();
      formData.set('status', newStatus);
      await updateDispatchLoadAction(orgId, loadId, formData);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border border-gray-700 bg-neutral-900 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Load {load.id || load.referenceNumber}</DialogTitle>
            <Badge className={getStatusBadgeColor(load.status)}>
              {load.status?.replace('_', ' ') ?? ''}
            </Badge>
          </div>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-700">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          {/* Details Tab */}
          <TabsContent value="details" className="mt-4 space-y-4">
            <Card className="bg-neutral-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white">
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Customer:</span> {load.customer?.name || ''}
                </p>
                <p>
                  <span className="font-medium">Priority:</span> {load.priority}
                </p>
                <p>
                  <span className="font-medium">Commodity:</span> {String(load.cargo)}
                </p>
                <p>
                  <span className="font-medium">Rate:</span> {String(load.rate)}
                </p>
                <p>
                  <span className="font-medium">Notes:</span> {String(load.notes)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white">Route</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <MapPin className="mr-1 inline h-4 w-4 text-blue-500" />
                  <span className="font-medium">Origin:</span> {String(load.origin)}
                </p>
                <p>
                  <Route className="mr-1 inline h-4 w-4 text-blue-500" />
                  <span className="font-medium">Destination:</span> {String(load.destination)}
                </p>
                <p>
                  <Calendar className="mr-1 inline h-4 w-4 text-blue-500" />
                  <span className="font-medium">Pickup:</span> {String(load.pickupDate)}
                </p>
                <p>
                  <Calendar className="mr-1 inline h-4 w-4 text-blue-500" />
                  <span className="font-medium">Delivery:</span> {String(load.deliveryDate)}
                </p>
              </CardContent>
            </Card>
            {(load.driver || load.vehicle) && (
              <Card className="bg-neutral-900 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white">
                    Current Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {load.driver && (
                    <p>
                      <User className="mr-1 inline h-4 w-4 text-blue-500" />
                      <span className="font-medium">Driver:</span> {load.driver.name}
                    </p>
                  )}
                  {load.vehicle && (
                    <p>
                      <Truck className="mr-1 inline h-4 w-4 text-blue-500" />
                      <span className="font-medium">Vehicle:</span> {load.vehicle.unit}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Assignment Tab */}
          <TabsContent value="assignment" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Driver</Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {activeDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tractor</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {activeTractors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.unitNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trailer</Label>
              <Select value={selectedTrailerId} onValueChange={setSelectedTrailerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trailer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {activeTrailers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.unitNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleAssign} disabled={isAssigning}>
                {isAssigning ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4">
            <LoadDocuments orgId={orgId} loadId={load.id} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4 text-sm">
            {load.statusEvents && load.statusEvents.length > 0 ? (
              <ul className="space-y-1">
                {load.statusEvents.map((event) => (
                  <li key={event.id}>
                    <span className="font-medium">{event.status.replace('_', ' ')}</span> –{' '}
                    {new Date(event.timestamp).toLocaleString()}
                    {event.notes ? ` (${event.notes})` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No status history available.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions Footer */}
        <DialogFooter className="mt-4 flex justify-between">
          <div className="flex gap-2">
            {load.status !== 'completed' && load.status !== 'cancelled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdatingStatus}
              >
                Cancel Load
              </Button>
            )}
            {load.status === 'assigned' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('in_transit')}
                disabled={isUpdatingStatus}
              >
                Mark In-Transit
              </Button>
            )}
            {load.status === 'in_transit' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdatingStatus}
              >
                Mark Completed
              </Button>
            )}
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/app/${load.id}/edit`}>Edit Load</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

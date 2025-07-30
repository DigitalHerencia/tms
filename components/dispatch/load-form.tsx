'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { createDispatchLoadAction, updateDispatchLoadAction } from '@/lib/actions/dispatchActions';
import { AddressFields } from '@/components/shared/AddressFields';
import { ContactFields } from '@/components/shared/ContactFields';
import { loadInputSchema } from '@/schemas/dispatch';

interface DriverOption {
  id: string;
  firstName: string;
  lastName: string;
}
interface VehicleOption {
  id: string;
  unitNumber: string;
  type: string;
}
interface LoadFormProps {
  orgId: string;
  load?: any;
  loadId?: string;
  drivers: DriverOption[];
  vehicles: VehicleOption[];
  onClose?: () => void;
}

type LoadInput = z.infer<typeof loadInputSchema>;

export function LoadForm({ orgId, load, loadId, drivers, vehicles, onClose }: LoadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tractors = vehicles.filter((v) => v.type === 'tractor');
  const trailers = vehicles.filter((v) => v.type === 'trailer');

  const form = useForm<LoadInput>({
    resolver: zodResolver(loadInputSchema),
    defaultValues: {
      load_number: load?.loadNumber || '',
      origin_address: load?.originAddress || '',
      origin_city: load?.originCity || '',
      origin_state: load?.originState || '',
      origin_zip: load?.originZip || '',
      destination_address: load?.destinationAddress || '',
      destination_city: load?.destinationCity || '',
      destination_state: load?.destinationState || '',
      destination_zip: load?.destinationZip || '',
      customer_id: load?.customerId || '',
      driver_id: load?.driver_id || '',
      vehicle_id: load?.vehicle_id || '',
      trailer_id: load?.trailer_id || '',
      scheduled_pickup_date: load?.scheduledPickupDate
        ? new Date(load.scheduledPickupDate).toISOString().slice(0, 16)
        : '',
      scheduled_delivery_date: load?.scheduledDeliveryDate
        ? new Date(load.scheduledDeliveryDate).toISOString().slice(0, 16)
        : '',
      notes: load?.notes || '',
      status: load?.status || 'pending',
    },
  });
  const { register, handleSubmit, formState: { errors }, setError } = form;

  const onSubmit = async (data: LoadInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    try {
      let result;
      if (load && (load.id || loadId)) {
        result = await updateDispatchLoadAction(orgId, load.id || (loadId as string), formData);
        if (result.success) {
          toast({ title: 'Load updated', description: 'Load details updated successfully.' });
          onClose ? onClose() : router.push(`/${orgId}/dispatch`);
        } else {
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              setError(field as keyof LoadInput, { message: messages.join(', ') });
            }
          }
          toast({
            title: 'Update failed',
            description: result.error || 'Could not update load.',
            variant: 'destructive',
          });
        }
      } else {
        result = await createDispatchLoadAction(orgId, formData);
        if (result.success) {
          toast({ title: 'Load created', description: 'New load has been created.' });
          onClose ? onClose() : router.push(`/${orgId}/dispatch`);
        } else {
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              setError(field as keyof LoadInput, { message: messages.join(', ') });
            }
          }
          toast({
            title: 'Creation failed',
            description: result.error || 'Could not create load.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error submitting load form:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl border border-gray-700 bg-neutral-900 text-gray-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {load ? 'Edit Load' : 'Create New Load'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-700">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>

            {/* Basic Info tab */}
            <TabsContent value="basic" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="load_number">Reference Number</Label>
                  <Input
                    id="load_number"
                    {...register('load_number')}
                    placeholder="e.g., L-1001"
                  />
                  {errors.load_number && (
                    <p className="text-sm text-red-500">{errors.load_number.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={load?.status || 'pending'} {...register('status')}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customer.name"
                  defaultValue={load?.customer?.name || ''}
                  placeholder="Customer or Company"
                  required
                />
              </div>
              <ContactFields values={{}} />
            </TabsContent>

            {/* Locations tab */}
            <TabsContent value="locations" className="mt-4 space-y-4">
              <div className="space-y-4">
                <Card className="bg-neutral-900 border border-gray-700">
                  <CardHeader>
                    <CardTitle>Origin</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AddressFields prefix="origin" register={register} errors={errors} required />
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_pickup_date">Pickup Date & Time</Label>
                      <Input
                        id="scheduled_pickup_date"
                        type="datetime-local"
                        {...register('scheduled_pickup_date')}
                        type="datetime-local"
                        required
                      />
                      {errors.scheduled_pickup_date && (
                        <p className="text-sm text-red-500">{errors.scheduled_pickup_date.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-neutral-900 border border-gray-700">
                  <CardHeader>
                    <CardTitle>Destination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AddressFields prefix="destination" register={register} errors={errors} required />
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_delivery_date">Delivery Date & Time</Label>
                      <Input
                        id="scheduled_delivery_date"
                        type="datetime-local"
                        {...register('scheduled_delivery_date')}
                        required
                      />
                      {errors.scheduled_delivery_date && (
                        <p className="text-sm text-red-500">{errors.scheduled_delivery_date.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assignment tab */}
            <TabsContent value="assignment" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver_id">Driver</Label>
                <Select defaultValue={load?.driver_id || load?.driver?.id || ''} {...register('driver_id')}>
                  <SelectTrigger id="driver_id">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_id">Tractor</Label>
                <Select defaultValue={load?.vehicle_id || load?.vehicle?.id || ''} {...register('vehicle_id')}>
                  <SelectTrigger id="vehicle_id">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {tractors.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.unitNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailer_id">Trailer</Label>
                <Select defaultValue={load?.trailer_id || load?.trailer?.id || ''} {...register('trailer_id')}>
                  <SelectTrigger id="trailer_id">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {trailers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.unitNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Additional Details tab */}
            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="commodity">Commodity</Label>
                  <Input
                    id="commodity"
                    name="commodity"
                    defaultValue={load?.commodity || ''}
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    defaultValue={load?.weight || ''}
                    placeholder="e.g., 15000"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate ($ Total)</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    step="0.01"
                    defaultValue={load?.rate || ''}
                    placeholder="e.g., 2500.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineHaul">Line Haul ($)</Label>
                  <Input
                    id="lineHaul"
                    name="lineHaul"
                    type="number"
                    step="0.01"
                    defaultValue={load?.lineHaul || ''}
                    placeholder="e.g., 2300.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            {onClose && (
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? load
                  ? 'Saving...'
                  : 'Creating...'
                : load
                  ? 'Update Load'
                  : 'Create Load'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

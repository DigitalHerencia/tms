'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VehicleForm } from '@/components/vehicles/vehicle-form';
import { Vehicle, VehicleFormData } from '@/types/vehicles';
import { updateVehicleAction } from '@/lib/actions/vehicleActions';
import { useToast } from '@/hooks/use-toast';

interface EditVehicleClientProps {
  orgId: string;
  vehicle: Vehicle;
}

export default function EditVehicleClient({ orgId, vehicle }: EditVehicleClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Convert vehicle data to form data format
  const convertToFormData = (vehicle: Vehicle): Partial<VehicleFormData> => {
    const formatDate = (date?: Date) => {
      if (!date) return '';
      return new Date(date).toISOString().split('T')[0];
    };

    return {
      unitNumber: vehicle.unitNumber,
      type: vehicle.type,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year,
      vin: vehicle.vin || '',
      licensePlate: vehicle.licensePlate || '',
      licensePlateState: vehicle.licensePlateState || '',
      grossVehicleWeight: vehicle.grossVehicleWeight,
      maxPayload: vehicle.maxPayload,
      fuelType: vehicle.fuelType || '',
      engineType: vehicle.engineType || '',
      fuelCapacity: vehicle.fuelCapacity,
      registrationNumber: vehicle.registrationNumber || '',
      registrationExpiration: formatDate(vehicle.registrationExpiration),
      insuranceProvider: vehicle.insuranceProvider || '',
      insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
      insuranceExpiration: formatDate(vehicle.insuranceExpiration),
      currentLocation: vehicle.currentLocation || '',
      totalMileage: vehicle.totalMileage,
      currentOdometer: vehicle.currentOdometer,
      nextMaintenanceDate: formatDate(vehicle.nextMaintenanceDate),
      nextMaintenanceMileage: vehicle.nextMaintenanceMileage,
      lastInspectionDate: formatDate(vehicle.lastInspectionDate),
      nextInspectionDue: formatDate(vehicle.nextInspectionDue),
      purchaseDate: formatDate(vehicle.purchaseDate),
      purchasePrice: vehicle.purchasePrice,
      currentValue: vehicle.currentValue,
      notes: vehicle.notes || '',
    };
  };

  const handleSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    try {
      // Convert form data to FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });
      formData.append('vehicleId', vehicle.id);
      formData.append('orgId', orgId);

      const result = await updateVehicleAction(null, formData);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Vehicle updated successfully',
        });
        router.push(`/${orgId}/vehicles/${vehicle.id}`);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update vehicle',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <VehicleForm
        initialData={convertToFormData(vehicle)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Update Vehicle"
      />
    </div>
  );
}

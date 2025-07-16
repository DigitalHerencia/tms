'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VehicleForm } from '@/components/vehicles/vehicle-form';
import { VehicleFormData } from '@/types/vehicles';
import { createVehicleAction } from '@/lib/actions/vehicleActions';
import { useToast } from '@/hooks/use-toast';

interface NewVehicleClientProps {
  orgId: string;
}

export default function NewVehicleClient({ orgId }: NewVehicleClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
      formData.append('orgId', orgId);

      const result = await createVehicleAction(null, formData);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Vehicle created successfully',
        });
        router.push(`/${orgId}/vehicles`);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create vehicle',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating vehicle:', error);
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
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Create Vehicle"
      />
    </div>
  );
}

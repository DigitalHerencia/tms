'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VehicleFormData, Vehicle } from '@/types/vehicles';
import { createVehicleAction } from '@/lib/actions/vehicleActions';

interface Props {
  orgId: string;
  onSuccess: (vehicle: Vehicle) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: VehicleFormData = {
  unitNumber: '',
  type: 'tractor',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  vin: '',
  licensePlate: '',
  fuelType: undefined,
  engineType: undefined,
  registrationNumber: undefined,
  registrationExpiration: undefined,
  insuranceProvider: undefined,
  insurancePolicyNumber: undefined,
  insuranceExpiration: undefined,
  currentLocation: undefined,
  totalMileage: undefined,
  nextMaintenanceDate: undefined,
  nextMaintenanceMileage: undefined,
};

export default function AddVehicleDialog({
  orgId,
  onSuccess,
  open,
  onOpenChange,
}: Props) {
  const [form, setForm] = useState<VehicleFormData>(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert form to FormData
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const result = await createVehicleAction(null, formData);
      if (result.success && result.data) {
        onSuccess(result.data as unknown as Vehicle);
        onOpenChange(false);
        setForm(initialState);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black border-muted text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Vehicle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber" className="text-white/90">Unit Number</Label>
              <Input
                id="unitNumber"
                name="unitNumber"
                value={form.unitNumber}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white/90">Vehicle Type</Label>
              <Select
                value={form.type}
                onValueChange={val =>
                  setForm(prev => ({
                    ...prev,
                    type: val as VehicleFormData['type'],
                  }))
                }
              >
                <SelectTrigger className="bg-neutral-900 border-muted text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-muted">
                  <SelectItem value="tractor" className="text-white hover:bg-blue-500/20">Tractor</SelectItem>
                  <SelectItem value="trailer" className="text-white hover:bg-blue-500/20">Trailer</SelectItem>
                  <SelectItem value="straight_truck" className="text-white hover:bg-blue-500/20">Straight Truck</SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-blue-500/20">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-white/90">Make</Label>
              <Input
                id="make"
                name="make"
                value={form.make}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white/90">Model</Label>
              <Input
                id="model"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-white/90">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin" className="text-white/90">VIN</Label>
              <Input
                id="vin"
                name="vin"
                value={form.vin}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {' '}
            <div className="space-y-2">
              <Label htmlFor="licensePlate" className="text-white/90">License Plate</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={form.licensePlate}
                onChange={handleChange}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Add Vehicle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { VehicleFormData, Vehicle, VehicleType } from '@/types/vehicles';
import { updateVehicleAction } from '@/lib/actions/vehicleActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  orgId: string;
  vehicle: Vehicle | null;
  onSuccess: (vehicle: Vehicle) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for editing an existing vehicle.
 *
 * Layout adapts to narrow viewports so all fields remain accessible on mobile.
 * /* See edit-vehicle-form.png */
 *
 * @param orgId - Organization identifier
 * @param vehicle - Vehicle to edit
 * @param onSuccess - Callback on successful update
 * @param open - Whether the dialog is open
 * @param onOpenChange - Handler to change open state
 */
export default function EditVehicleDialog({
  orgId,
  vehicle,
  onSuccess,
  open,
  onOpenChange,
}: Props) {
  const [form, setForm] = useState<Partial<VehicleFormData>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (vehicle) {
      setForm({
        unitNumber: vehicle.unitNumber || '',
        type: vehicle.type,
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        vin: vehicle.vin || '',
        licensePlate: vehicle.licensePlate || '',
        licensePlateState: vehicle.licensePlateState || '',
      });
    }
  }, [vehicle]);

  const handleChange = (field: keyof VehicleFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    
    setLoading(true);
    try {
      // Convert form to FormData
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });
      formData.append('orgId', orgId);
      formData.append('vehicleId', vehicle.id);

      const result = await updateVehicleAction(null, formData);
      if (result.success && result.data) {
        onSuccess(result.data as unknown as Vehicle);
        onOpenChange(false);
        toast({
          title: 'Success',
          description: 'Vehicle updated successfully',
        });
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
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-muted text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Basic Information Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitNumber" className="text-white">Unit Number *</Label>
                <Input
                  id="unitNumber"
                  value={form.unitNumber || ''}
                  onChange={(e) => handleChange('unitNumber', e.target.value)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="e.g., TRK-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Vehicle Type *</Label>
                <Select 
                  value={form.type || 'tractor'} 
                  onValueChange={(value: VehicleType) => handleChange('type', value)}
                >
                  <SelectTrigger className="bg-neutral-900 border-muted text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-muted">
                    <SelectItem value="tractor">Tractor</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="straight_truck">Straight Truck</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Basic Information Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-white">Make</Label>
                <Input
                  id="make"
                  value={form.make || ''}
                  onChange={(e) => handleChange('make', e.target.value)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="e.g., Freightliner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-white">Model</Label>
                <Input
                  id="model"
                  value={form.model || ''}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="e.g., Cascadia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-white">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year || ''}
                  onChange={(e) => handleChange('year', parseInt(e.target.value) || 0)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="2023"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            {/* VIN */}
            <div className="space-y-2">
              <Label htmlFor="vin" className="text-white">VIN</Label>
              <Input
                id="vin"
                value={form.vin || ''}
                onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                placeholder="17-character VIN"
                maxLength={17}
              />
            </div>

            {/* License Plate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate" className="text-white">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={form.licensePlate || ''}
                  onChange={(e) => handleChange('licensePlate', e.target.value)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="ABC123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlateState" className="text-white">State</Label>
                <Input
                  id="licensePlateState"
                  value={form.licensePlateState || ''}
                  onChange={(e) => handleChange('licensePlateState', e.target.value.toUpperCase())}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="CO"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Note about advanced fields */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <p className="text-sm text-blue-400">
                💡 For advanced specifications, insurance, and financial details, use the dedicated edit page.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
            >
              {loading ? 'Updating...' : 'Update Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

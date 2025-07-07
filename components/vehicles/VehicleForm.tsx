'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { useActionState } from 'react';

import { Vehicle, VehicleFormData, VehicleActionResult, VehicleStatus as VehicleStatusType } from '@/types/vehicles'; // Renamed VehicleStatus to VehicleStatusType to avoid conflict
import { createVehicleAction, updateVehicleAction } from '@/lib/actions/vehicleActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface VehicleFormProps {
  vehicle?: Vehicle;
  orgId: string;
  onSuccess?: (vehicle: Vehicle) => void;
  onCancel?: () => void;
}

export function VehicleForm({ vehicle, orgId, onSuccess, onCancel }: VehicleFormProps) {
  const isEdit = !!vehicle;
  const [formData, setFormData] = useState<VehicleFormData>(() => {
    const initialYear = vehicle?.year || new Date().getFullYear();
    const parseDate = (dateString?: string | Date): string | undefined => {
      if (!dateString) return undefined;
      if (dateString instanceof Date) return dateString.toISOString().split('T')[0];
      // Attempt to parse if it's a string that might be a date
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      return dateString; // Fallback if not a valid date string
    };

    return {
      unitNumber: vehicle?.unitNumber || '',
      type: vehicle?.type || 'tractor',
      make: vehicle?.make || '',
      model: vehicle?.model || '',
      year: typeof initialYear === 'string' ? parseInt(initialYear) : initialYear, // Ensure year is number
      vin: vehicle?.vin || '',
      licensePlate: vehicle?.licensePlate || '',
      fuelType: vehicle?.fuelType,
      engineType: vehicle?.engineType,
      registrationNumber: vehicle?.registrationNumber,
      registrationExpiry: parseDate(vehicle?.registrationExpiry),
      insuranceProvider: vehicle?.insuranceProvider,
      insurancePolicyNumber: vehicle?.insurancePolicyNumber,
      insuranceExpiry: parseDate(vehicle?.insuranceExpiry),
      currentLocation: vehicle?.currentLocation,
      totalMileage: vehicle?.totalMileage,
      nextMaintenanceDate: parseDate(vehicle?.nextMaintenanceDate),
      nextMaintenanceMileage: vehicle?.nextMaintenanceMileage,
    };
  });

  const actionToUse = isEdit ? updateVehicleAction : createVehicleAction;
  const [state, formAction, isPending] = useActionState<VehicleActionResult | null, FormData>(
    actionToUse,
    null
  );

  useEffect(() => {
    if (state?.success && state.vehicle && onSuccess) {
      onSuccess(state.vehicle);
    }
  }, [state, onSuccess]);

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    let processedValue = value;
    if (field === 'year' || field === 'totalMileage' || field === 'nextMaintenanceMileage') {
      processedValue = value ? parseInt(value, 10) : undefined;
      if (isNaN(processedValue as number)) {
        processedValue = undefined;
      }
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden input for vehicleId when editing */} 
      {isEdit && vehicle?.id && (
        <input type="hidden" name="vehicleId" value={vehicle.id} />
      )}
      {/* Hidden input for orgId - though server action should get it from auth */} 
      <input type="hidden" name="orgId" value={orgId} />

      {state?.error && !state.fieldErrors && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{state.error}</div>
        </div>
      )}
      {state?.fieldErrors && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm font-medium text-red-700">Please correct the following errors:</div>
          <ul className="list-disc pl-5 mt-2 text-sm text-red-700">
            {Object.entries(state.fieldErrors).map(([field, errors]) => (
              errors?.map((error: string) => (
                <li key={`${field}-${error}`}>{error}</li>
              ))
            ))}
          </ul>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Basic Information
            {isEdit && vehicle?.status && (
              <Badge variant={vehicle.status === 'available' || vehicle.status === 'assigned' ? 'default' : 'secondary'}>
                {vehicle.status.replace('_', ' ').toLowerCase()}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Essential vehicle identification and specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                name="unitNumber" // Added name attribute
                value={formData.unitNumber}
                onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                placeholder="e.g., TRK-001"
                required
              />
              {state?.fieldErrors?.unitNumber && (
                <p className="text-sm text-red-600">{state.fieldErrors.unitNumber[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select
                name="type" // Added name attribute
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tractor">Tractor</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="straight_truck">Straight Truck</SelectItem>
                  <SelectItem value="pickup">Pickup Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                name="make" // Added name attribute
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Freightliner"
                required
              />
               {state?.fieldErrors?.make && (
                <p className="text-sm text-red-600">{state.fieldErrors.make[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                name="model" // Added name attribute
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Cascadia"
                required
              />
              {state?.fieldErrors?.model && (
                <p className="text-sm text-red-600">{state.fieldErrors.model[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                name="year" // Added name attribute
                type="number"
                value={formData.year || ''} // Ensure value is not undefined for controlled input
                onChange={(e) => handleInputChange('year', e.target.value)}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
              {state?.fieldErrors?.year && (
                <p className="text-sm text-red-600">{state.fieldErrors.year[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN *</Label>
              <Input
                id="vin"
                name="vin" // Added name attribute
                value={formData.vin}
                onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                placeholder="17-character VIN"
                maxLength={17}
                required
              />
              {state?.fieldErrors?.vin && (
                <p className="text-sm text-red-600">{state.fieldErrors.vin[0]}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration & Licensing */} 
      <Card>
        <CardHeader>
          <CardTitle>Registration & Licensing</CardTitle>
          <CardDescription>
            License plate and registration information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                name="licensePlate" // Added name attribute
                value={formData.licensePlate || ''}
                onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                name="registrationNumber" // Added name attribute
                value={formData.registrationNumber || ''}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="Registration number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationExpiry">Registration Expiry</Label>
              <Input
                id="registrationExpiry"
                name="registrationExpiry" // Added name attribute
                type="date"
                value={formData.registrationExpiry || ''} // Dates are strings 'YYYY-MM-DD'
                onChange={(e) => handleInputChange('registrationExpiry', e.target.value || undefined)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engine & Fuel */} 
      <Card>
        <CardHeader>
          <CardTitle>Engine & Fuel Specifications</CardTitle>
          <CardDescription>
            Engine and fuel system details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select
                name="fuelType" // Added name attribute
                value={formData.fuelType || ''}
                onValueChange={(value) => handleInputChange('fuelType', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="natural_gas">Natural Gas</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engineType">Engine Type</Label>
              <Input
                id="engineType"
                name="engineType" // Added name attribute
                value={formData.engineType || ''}
                onChange={(e) => handleInputChange('engineType', e.target.value || undefined)}
                placeholder="e.g., Cummins X15"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance */} 
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
          <CardDescription>
            Insurance coverage details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                name="insuranceProvider" // Added name attribute
                value={formData.insuranceProvider || ''}
                onChange={(e) => handleInputChange('insuranceProvider', e.target.value || undefined)}
                placeholder="e.g., Progressive"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
              <Input
                id="insurancePolicyNumber"
                name="insurancePolicyNumber" // Added name attribute
                value={formData.insurancePolicyNumber || ''}
                onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value || undefined)}
                placeholder="Insurance policy number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
              <Input
                id="insuranceExpiry"
                name="insuranceExpiry" // Added name attribute
                type="date"
                value={formData.insuranceExpiry || ''} // Dates are strings 'YYYY-MM-DD'
                onChange={(e) => handleInputChange('insuranceExpiry', e.target.value || undefined)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Maintenance */} 
      <Card>
        <CardHeader>
          <CardTitle>Location & Maintenance</CardTitle>
          <CardDescription>
            Current location and maintenance information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location</Label>
              <Input
                id="currentLocation"
                name="currentLocation" // Added name attribute
                value={formData.currentLocation || ''}
                onChange={(e) => handleInputChange('currentLocation', e.target.value || undefined)}
                placeholder="e.g., Denver, CO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMileage">Total Mileage</Label>
              <Input
                id="totalMileage"
                name="totalMileage" // Added name attribute
                type="number"
                value={formData.totalMileage || ''} // Ensure value is not undefined
                onChange={(e) => handleInputChange('totalMileage', e.target.value)}
                placeholder="Current odometer reading"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
              <Input
                id="nextMaintenanceDate"
                name="nextMaintenanceDate" // Added name attribute
                type="date"
                value={formData.nextMaintenanceDate || ''} // Dates are strings 'YYYY-MM-DD'
                onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceMileage">Next Maintenance Mileage</Label>
              <Input
                id="nextMaintenanceMileage"
                name="nextMaintenanceMileage" // Added name attribute
                type="number"
                value={formData.nextMaintenanceMileage || ''} // Ensure value is not undefined
                onChange={(e) => handleInputChange('nextMaintenanceMileage', e.target.value)}
                placeholder="Mileage for next service"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </div>
    </form>
  );
}

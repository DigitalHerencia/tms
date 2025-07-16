'use client';

import { useState } from 'react';
import { VehicleFormData, VehicleType } from '@/types/vehicles';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const initialFormState: VehicleFormData = {
  type: 'tractor',
  unitNumber: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  vin: '',
  licensePlate: '',
  licensePlateState: '',
  grossVehicleWeight: undefined,
  maxPayload: undefined,
  fuelType: '',
  engineType: '',
  fuelCapacity: undefined,
  registrationNumber: '',
  registrationExpiration: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insuranceExpiration: '',
  currentLocation: '',
  totalMileage: undefined,
  currentOdometer: undefined,
  nextMaintenanceDate: '',
  nextMaintenanceMileage: undefined,
  lastInspectionDate: '',
  nextInspectionDue: '',
  purchaseDate: '',
  purchasePrice: undefined,
  currentValue: undefined,
  notes: '',
};

export function VehicleForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  submitLabel = 'Save Vehicle' 
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    ...initialFormState,
    ...initialData,
  });

  const handleChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-black border-muted">
          <TabsTrigger 
            value="basic"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Basic Information
          </TabsTrigger>
          <TabsTrigger 
            value="specifications"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="registration"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Registration & Insurance
          </TabsTrigger>
          <TabsTrigger 
            value="operational"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Operational
          </TabsTrigger>
          <TabsTrigger 
            value="financial"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card className="bg-black border-muted">
            <CardHeader>
              <CardTitle className="text-white">Basic Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber" className="text-white">Unit Number *</Label>
                  <Input
                    id="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => handleChange('unitNumber', e.target.value)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="Enter unit number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">Vehicle Type *</Label>
                  <Select value={formData.type} onValueChange={(value: VehicleType) => handleChange('type', value)}>
                    <SelectTrigger className="bg-neutral-900 border-muted text-white">
                      <SelectValue placeholder="Select vehicle type" />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make" className="text-white">Make</Label>
                  <Input
                    id="make"
                    value={formData.make || ''}
                    onChange={(e) => handleChange('make', e.target.value)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="e.g., Freightliner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-white">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || ''}
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
                    value={formData.year || ''}
                    onChange={(e) => handleChange('year', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="2023"
                    min="1950"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vin" className="text-white">VIN</Label>
                  <Input
                    id="vin"
                    value={formData.vin || ''}
                    onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="17-character VIN"
                    maxLength={17}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate" className="text-white">License Plate</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate || ''}
                      onChange={(e) => handleChange('licensePlate', e.target.value)}
                      className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                      placeholder="ABC123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlateState" className="text-white">State</Label>
                    <Input
                      id="licensePlateState"
                      value={formData.licensePlateState || ''}
                      onChange={(e) => handleChange('licensePlateState', e.target.value.toUpperCase())}
                      className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                      placeholder="CO"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="bg-black border-muted">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossVehicleWeight" className="text-white">Gross Vehicle Weight (lbs)</Label>
                  <Input
                    id="grossVehicleWeight"
                    type="number"
                    value={formData.grossVehicleWeight || ''}
                    onChange={(e) => handleChange('grossVehicleWeight', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPayload" className="text-white">Max Payload (lbs)</Label>
                  <Input
                    id="maxPayload"
                    type="number"
                    value={formData.maxPayload || ''}
                    onChange={(e) => handleChange('maxPayload', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="34000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="text-white">Fuel Type</Label>
                  <Select value={formData.fuelType || ''} onValueChange={(value) => handleChange('fuelType', value)}>
                    <SelectTrigger className="bg-neutral-900 border-muted text-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-muted">
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineType" className="text-white">Engine Type</Label>
                  <Input
                    id="engineType"
                    value={formData.engineType || ''}
                    onChange={(e) => handleChange('engineType', e.target.value)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="e.g., Detroit DD15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelCapacity" className="text-white">Fuel Capacity (gallons)</Label>
                  <Input
                    id="fuelCapacity"
                    type="number"
                    value={formData.fuelCapacity || ''}
                    onChange={(e) => handleChange('fuelCapacity', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="mt-6">
          <Card className="bg-black border-muted">
            <CardHeader>
              <CardTitle className="text-white">Registration & Insurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-white">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber || ''}
                      onChange={(e) => handleChange('registrationNumber', e.target.value)}
                      className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                      placeholder="Registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationExpiration" className="text-white">Registration Expiration</Label>
                    <Input
                      id="registrationExpiration"
                      type="date"
                      value={formData.registrationExpiration || ''}
                      onChange={(e) => handleChange('registrationExpiration', e.target.value)}
                      className="bg-neutral-900 border-muted text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider" className="text-white">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider || ''}
                      onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                      className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                      placeholder="Insurance company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicyNumber" className="text-white">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber || ''}
                      onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)}
                      className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                      placeholder="Policy number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiration" className="text-white">Insurance Expiration</Label>
                  <Input
                    id="insuranceExpiration"
                    type="date"
                    value={formData.insuranceExpiration || ''}
                    onChange={(e) => handleChange('insuranceExpiration', e.target.value)}
                    className="bg-neutral-900 border-muted text-white w-full md:w-1/2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="mt-6">
          <Card className="bg-black border-muted">
            <CardHeader>
              <CardTitle className="text-white">Operational Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLocation" className="text-white">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation || ''}
                    onChange={(e) => handleChange('currentLocation', e.target.value)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMileage" className="text-white">Total Mileage</Label>
                  <Input
                    id="totalMileage"
                    type="number"
                    value={formData.totalMileage || ''}
                    onChange={(e) => handleChange('totalMileage', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="Miles"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentOdometer" className="text-white">Current Odometer</Label>
                  <Input
                    id="currentOdometer"
                    type="number"
                    value={formData.currentOdometer || ''}
                    onChange={(e) => handleChange('currentOdometer', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="Current odometer reading"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenanceMileage" className="text-white">Next Maintenance Mileage</Label>
                  <Input
                    id="nextMaintenanceMileage"
                    type="number"
                    value={formData.nextMaintenanceMileage || ''}
                    onChange={(e) => handleChange('nextMaintenanceMileage', parseInt(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="Mileage for next service"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenanceDate" className="text-white">Next Maintenance Date</Label>
                  <Input
                    id="nextMaintenanceDate"
                    type="date"
                    value={formData.nextMaintenanceDate || ''}
                    onChange={(e) => handleChange('nextMaintenanceDate', e.target.value)}
                    className="bg-neutral-900 border-muted text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastInspectionDate" className="text-white">Last Inspection Date</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={formData.lastInspectionDate || ''}
                    onChange={(e) => handleChange('lastInspectionDate', e.target.value)}
                    className="bg-neutral-900 border-muted text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInspectionDue" className="text-white">Next Inspection Due</Label>
                  <Input
                    id="nextInspectionDue"
                    type="date"
                    value={formData.nextInspectionDue || ''}
                    onChange={(e) => handleChange('nextInspectionDue', e.target.value)}
                    className="bg-neutral-900 border-muted text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <Card className="bg-black border-muted">
            <CardHeader>
              <CardTitle className="text-white">Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate" className="text-white">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate || ''}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    className="bg-neutral-900 border-muted text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice" className="text-white">Purchase Price ($)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="150000.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentValue" className="text-white">Current Value ($)</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    step="0.01"
                    value={formData.currentValue || ''}
                    onChange={(e) => handleChange('currentValue', parseFloat(e.target.value) || undefined)}
                    className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                    placeholder="125000.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="bg-neutral-900 border-muted text-white placeholder:text-white/50"
                  placeholder="Additional notes about this vehicle..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

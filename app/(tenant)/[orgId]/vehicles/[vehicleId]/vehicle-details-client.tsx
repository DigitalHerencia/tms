'use client';

import { useState } from 'react';
import type { Vehicle } from '@/types/vehicles';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Truck,
  Edit,
  MapPin,
  Calendar,
  Gauge,
  FileText,
  Wrench,
  Shield,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { getVehicleStatusColor } from '@/lib/utils/status';

interface VehicleDetailsClientProps {
  orgId: string;
  vehicle: Vehicle;
}

export default function VehicleDetailsClient({ orgId, vehicle }: VehicleDetailsClientProps) {

  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'Not set';
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Link href={`/${orgId}/vehicles/${vehicle.id}/edit`}>
          <button className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 inline-flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Vehicle
          </button>
        </Link>
        <button className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800 inline-flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black border-muted">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Overview
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
            value="maintenance"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Maintenance
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="bg-black border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Unit Number:</span>
                  <span className="text-white font-medium">{vehicle.unitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <Badge className={getVehicleStatusColor(vehicle.status)}>
                    {vehicle.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Type:</span>
                  <span className="text-white">{vehicle.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Make:</span>
                  <span className="text-white">{vehicle.make || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Model:</span>
                  <span className="text-white">{vehicle.model || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Year:</span>
                  <span className="text-white">{vehicle.year || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">VIN:</span>
                  <span className="text-white font-mono text-sm">{vehicle.vin || 'Not set'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Location & Mileage */}
            <Card className="bg-black border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  Location & Mileage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Current Location:</span>
                  <span className="text-white">{vehicle.currentLocation || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Mileage:</span>
                  <span className="text-white">{formatMileage(vehicle.totalMileage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Current Odometer:</span>
                  <span className="text-white">{formatMileage(vehicle.currentOdometer)}</span>
                </div>
                {vehicle.lastOdometerUpdate && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Last Updated:</span>
                    <span className="text-white text-sm">
                      {formatDate(vehicle.lastOdometerUpdate)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Status */}
            <Card className="bg-black border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Quick Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Next Maintenance:</span>
                  <span className="text-white text-sm">
                    {formatDate(vehicle.nextMaintenanceDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">At Mileage:</span>
                  <span className="text-white">
                    {formatMileage(vehicle.nextMaintenanceMileage)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Last Inspection:</span>
                  <span className="text-white text-sm">
                    {formatDate(vehicle.lastInspectionDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Next Inspection:</span>
                  <span className="text-white text-sm">
                    {formatDate(vehicle.nextInspectionDue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-muted">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-400" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Gross Vehicle Weight:</span>
                  <span className="text-white">
                    {vehicle.grossVehicleWeight
                      ? `${vehicle.grossVehicleWeight.toLocaleString()} lbs`
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Max Payload:</span>
                  <span className="text-white">
                    {vehicle.maxPayload ? `${vehicle.maxPayload.toLocaleString()} lbs` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Fuel Type:</span>
                  <span className="text-white">{vehicle.fuelType || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Engine Type:</span>
                  <span className="text-white">{vehicle.engineType || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Fuel Capacity:</span>
                  <span className="text-white">
                    {vehicle.fuelCapacity ? `${vehicle.fuelCapacity} gallons` : 'Not set'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Additional specs can be added here */}
          </div>
        </TabsContent>

        <TabsContent value="registration" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-muted">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Registration Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">License Plate:</span>
                  <span className="text-white">
                    {vehicle.licensePlate
                      ? `${vehicle.licensePlate} (${vehicle.licensePlateState})`
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Registration Number:</span>
                  <span className="text-white">{vehicle.registrationNumber || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Registration Expires:</span>
                  <span className="text-white">{formatDate(vehicle.registrationExpiration)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-muted">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Insurance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Provider:</span>
                  <span className="text-white">{vehicle.insuranceProvider || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Policy Number:</span>
                  <span className="text-white">{vehicle.insurancePolicyNumber || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Expires:</span>
                  <span className="text-white">{formatDate(vehicle.insuranceExpiration)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-black border-muted">
              <CardHeader>
                <CardTitle className="text-white">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-white/70">
                  Maintenance records and scheduling will be implemented here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-muted">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Purchase Date:</span>
                  <span className="text-white">{formatDate(vehicle.purchaseDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Purchase Price:</span>
                  <span className="text-white">{formatCurrency(vehicle.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Current Value:</span>
                  <span className="text-white">{formatCurrency(vehicle.currentValue)}</span>
                </div>
                {vehicle.purchasePrice && vehicle.currentValue && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Depreciation:</span>
                    <span className="text-white">
                      {formatCurrency(vehicle.purchasePrice - vehicle.currentValue)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notes Section */}
      {vehicle.notes && (
        <Card className="bg-black border-muted">
          <CardHeader>
            <CardTitle className="text-white">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-white/90 whitespace-pre-wrap">{vehicle.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import type { Vehicle } from '@/types/vehicles';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleDetailsDialog } from '@/components/vehicles/vehicle-details-dialog';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface VehiclesClientProps {
  orgId: string;
  initialVehicles: Vehicle[];
}

export default function VehiclesClient({ orgId, initialVehicles }: VehiclesClientProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsDialogOpen(true);
  };

  const handleVehicleUpdate = (updatedVehicle: Vehicle) => {
    setSelectedVehicle(updatedVehicle);
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="flex rounded-md border border-muted overflow-hidden">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={`rounded-none px-3 py-2 ${
              viewMode === 'table'
                ? 'bg-blue-500 text-white hover:bg-blue-800'
                : 'text-white/70 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`rounded-none px-3 py-2 ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white hover:bg-blue-800'
                : 'text-white/70 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <VehicleTable vehicles={vehicles} orgId={orgId} onVehicleSelect={handleVehicleSelect} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              className="border-muted rounded-md border bg-neutral-900"
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => handleVehicleSelect(vehicle)}
            />
          ))}
        </div>
      )}

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onVehicleUpdate={handleVehicleUpdate}
        />
      )}
    </div>
  );
}

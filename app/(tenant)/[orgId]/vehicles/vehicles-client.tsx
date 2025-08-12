'use client';

import React, { useState } from 'react';
import type { Vehicle, VehicleListResponse } from '@/types/vehicles';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleDetailsDialog } from '@/components/vehicles/vehicle-details-dialog';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VehiclesClientProps {
  orgId: string;
  initialVehicles: Vehicle[];
  initialPage: number;
  totalPages: number;
  fetchPage: (page: number) => Promise<VehicleListResponse>;
}

export default function VehiclesClient({
  orgId,
  initialVehicles,
  initialPage,
  totalPages: initialTotalPages,
  fetchPage,
}: VehiclesClientProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const res = await fetchPage(nextPage);
    setVehicles((prev) => [...prev, ...res.data]);
    setPage(nextPage);
    setTotalPages(res.totalPages);
  };

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
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'grid')}>
          <TabsList className="grid w-auto grid-cols-2 bg-black border border-gray-200">
            <TabsTrigger
              value="table"
              className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500"
            >
              <List className="h-4 w-4" /> Table
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500"
            >
              <Grid className="h-4 w-4" /> Grid
            </TabsTrigger>
          </TabsList>
        </Tabs>
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

      {page < totalPages && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore}>Load More</Button>
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

'use client';

import { useState } from 'react';
import { Vehicle, VehicleStatus } from '@/types/vehicles';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Eye, 
  Edit, 
  Truck, 
  Calendar, 
  MapPin, 
  Gauge,
  FileText,
  Download,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface VehicleTableProps {
  vehicles: Vehicle[];
  orgId: string;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  showActions?: boolean;
}

export function VehicleTable({ 
  vehicles, // <-- add vehicles here
  orgId, 
  onVehicleSelect,
  showActions = true 
}: VehicleTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'decommissioned':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = [
      vehicle.unitNumber,
      vehicle.make,
      vehicle.model,
      vehicle.vin,
      vehicle.licensePlate,
    ].some(field => 
      field?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = Array.from(new Set(vehicles.map(v => v.type))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-black border-muted">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
                <Input
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-neutral-900 border-muted text-white placeholder:text-white/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <Select value={statusFilter} onValueChange={(value: VehicleStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger className="bg-neutral-900 border-muted text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-muted">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-neutral-900 border-muted text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-muted">
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Actions</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-white/70 text-sm">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Table */}
      <Card className="bg-black border-muted">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-muted hover:bg-neutral-900/50">
                <TableHead className="text-white font-semibold">Vehicle Info</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Specifications</TableHead>
                <TableHead className="text-white font-semibold">Registration</TableHead>
                <TableHead className="text-white font-semibold">Location</TableHead>
                <TableHead className="text-white font-semibold">Maintenance</TableHead>
                <TableHead className="text-white font-semibold">Financial</TableHead>
                {showActions && (
                  <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={showActions ? 8 : 7} 
                    className="text-center text-white/70 py-8"
                  >
                    {search || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'No vehicles found matching your filters.' 
                      : 'No vehicles found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow 
                    key={vehicle.id} 
                    className="border-muted hover:bg-neutral-900/50 cursor-pointer"
                    onClick={() => onVehicleSelect?.(vehicle)}
                  >
                    {/* Vehicle Info */}
                    <TableCell className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-white">
                          {vehicle.unitNumber}
                        </span>
                      </div>
                      <div className="text-sm text-white/70">
                        {vehicle.make} {vehicle.model} {vehicle.year}
                      </div>
                      {vehicle.vin && (
                        <div className="text-xs text-white/60 font-mono">
                          VIN: {vehicle.vin}
                        </div>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    {/* Specifications */}
                    <TableCell className="space-y-1">
                      <div className="text-sm text-white">
                        Type: {vehicle.type.replace('_', ' ')}
                      </div>
                      {vehicle.fuelType && (
                        <div className="text-xs text-white/70">
                          Fuel: {vehicle.fuelType}
                        </div>
                      )}
                      {vehicle.grossVehicleWeight && (
                        <div className="text-xs text-white/70">
                          GVW: {vehicle.grossVehicleWeight.toLocaleString()} lbs
                        </div>
                      )}
                    </TableCell>

                    {/* Registration */}
                    <TableCell className="space-y-1">
                      {vehicle.licensePlate && (
                        <div className="text-sm text-white">
                          {vehicle.licensePlate} ({vehicle.licensePlateState})
                        </div>
                      )}
                      {vehicle.registrationExpiration && (
                        <div className="text-xs text-white/70">
                          Reg Exp: {formatDate(vehicle.registrationExpiration)}
                        </div>
                      )}
                      {vehicle.insuranceExpiration && (
                        <div className="text-xs text-white/70">
                          Ins Exp: {formatDate(vehicle.insuranceExpiration)}
                        </div>
                      )}
                    </TableCell>

                    {/* Location */}
                    <TableCell className="space-y-1">
                      {vehicle.currentLocation && (
                        <div className="flex items-center gap-1 text-sm text-white">
                          <MapPin className="h-3 w-3" />
                          {vehicle.currentLocation}
                        </div>
                      )}
                      {vehicle.totalMileage && (
                        <div className="flex items-center gap-1 text-xs text-white/70">
                          <Gauge className="h-3 w-3" />
                          {formatMileage(vehicle.totalMileage)}
                        </div>
                      )}
                    </TableCell>

                    {/* Maintenance */}
                    <TableCell className="space-y-1">
                      {vehicle.nextMaintenanceDate && (
                        <div className="flex items-center gap-1 text-xs text-white/70">
                          <Calendar className="h-3 w-3" />
                          Next: {formatDate(vehicle.nextMaintenanceDate)}
                        </div>
                      )}
                      {vehicle.nextMaintenanceMileage && (
                        <div className="text-xs text-white/70">
                          At: {formatMileage(vehicle.nextMaintenanceMileage)}
                        </div>
                      )}
                      {vehicle.lastInspectionDate && (
                        <div className="text-xs text-white/70">
                          Last Insp: {formatDate(vehicle.lastInspectionDate)}
                        </div>
                      )}
                    </TableCell>

                    {/* Financial */}
                    <TableCell className="space-y-1">
                      {vehicle.purchasePrice && (
                        <div className="text-sm text-white">
                          {formatCurrency(vehicle.purchasePrice)}
                        </div>
                      )}
                      {vehicle.currentValue && (
                        <div className="text-xs text-white/70">
                          Current: {formatCurrency(vehicle.currentValue)}
                        </div>
                      )}
                      {vehicle.purchaseDate && (
                        <div className="text-xs text-white/70">
                          Purchased: {formatDate(vehicle.purchaseDate)}
                        </div>
                      )}
                    </TableCell>

                    {/* Actions */}
                    {showActions && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/${orgId}/vehicles/${vehicle.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-neutral-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/${orgId}/vehicles/${vehicle.id}/edit`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-neutral-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-neutral-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle export individual vehicle
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

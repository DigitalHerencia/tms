'use client';

import {
  SearchIcon,
  UploadIcon,
  DownloadIcon,
  FilterIcon,
  FileTextIcon,
  FileWarningIcon,
  FileCheckIcon,
} from 'lucide-react';
import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TripReport } from '@/types/ifta';

interface IftaTripTableProps {
  trips: TripReport[];
}

export function IftaTripTable({ trips }: IftaTripTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="grid gap-4">
      <div className="border-muted rounded-lg border bg-black p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SearchIcon className="text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <UploadIcon className="mr-2 h-4 w-4" />
              Import Trips
            </Button>
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Trips
            </Button>
            <Button variant="outline">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>Add Trip</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 text-left text-sm font-medium">User</TableHead>
              <TableHead className="p-2 text-left text-sm font-medium">Vehicle</TableHead>
              <TableHead className="p-2 text-left text-sm font-medium">Jurisdictions</TableHead>
              <TableHead className="p-2 text-right text-sm font-medium">Total Miles</TableHead>
              <TableHead className="p-2 text-left text-sm font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} className="border-b">
                <TableCell className="p-2 text-sm">{trip.userId}</TableCell>
                <TableCell className="p-2 text-sm">{trip.vehicleId}</TableCell>
                <TableCell className="p-2 text-sm">
                  {trip.jurisdictions.map((j) => j.jurisdiction).join(', ')}
                </TableCell>
                <TableCell className="p-2 text-right text-sm">{trip.totalMiles}</TableCell>
                <TableCell className="p-2 text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <FileTextIcon className="h-5 w-5" />
                      <span className="sr-only">View Trip</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileWarningIcon className="h-5 w-5 text-yellow-500" />
                      <span className="sr-only">View Discrepancies</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileCheckIcon className="h-5 w-5 text-green-500" />
                      <span className="sr-only">Mark as Reconciled</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm">
            View All Trips
          </Button>
        </div>
      </div>
    </div>
  );
}

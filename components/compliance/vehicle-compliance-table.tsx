'use client';

import { useState, type JSX } from 'react';
import { MoreHorizontal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define the Vehicle type
export interface Vehicle {
  id: string;
  unit: string;
  status: string;
  lastInspection: string;
  nextInspection: string;
  defects: string;
  registrationExpiry: string;
  type: string;
}

// Props for VehicleComplianceTable
interface VehicleComplianceTableProps {
  orgId: string;
}

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'unit',
    header: 'Unit Number',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('unit')}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex items-center gap-2">
          {status === 'Compliant' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : status === 'Warning' ? (
            <Clock className="h-4 w-4 text-amber-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <Badge
            className={
              status === 'Compliant'
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : status === 'Warning'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                  : 'bg-red-100 text-red-800 hover:bg-red-100'
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'lastInspection',
    header: 'Last Inspection',
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.getValue('lastInspection')).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'nextInspection',
    header: 'Next Inspection',
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.getValue('nextInspection')).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'defects',
    header: 'Defects',
    cell: ({ row }) => {
      const defects = row.getValue('defects') as string;
      return defects === 'None' ? (
        <span className="text-muted-foreground">None</span>
      ) : (
        <span className="text-red-600">{defects}</span>
      );
    },
  },
  {
    accessorKey: 'registrationExpiry',
    header: 'Registration Expiry',
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.getValue('registrationExpiry')).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
            <DropdownMenuItem>Schedule Inspection</DropdownMenuItem>
            <DropdownMenuItem>View Maintenance History</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function VehicleComplianceTable({
  orgId
}: VehicleComplianceTableProps): JSX.Element {
  // TODO: Fetch vehicle compliance data using orgId once API endpoints are ready
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vehicle Compliance</h2>
        <Button>Schedule Inspection</Button>
      </div>

      {/* Vehicle list would go here */}
      <div className="text-sm text-muted-foreground">
        Vehicle compliance data for organization: {orgId}
      </div>
    </div>
  );
}

'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import type { IftaTripTableRow, IftaReportTableRow } from '@/types/ifta';

export type IFTATrip = IftaTripTableRow;
export type IFTAReport = IftaReportTableRow;

export const tripColumns: ColumnDef<IFTATrip>[] = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'driver', header: 'Driver' },
  { accessorKey: 'vehicle', header: 'Vehicle' },
  { accessorKey: 'startLocation', header: 'Origin' },
  { accessorKey: 'endLocation', header: 'Destination' },
  { accessorKey: 'state', header: 'Jurisdiction' },
  { accessorKey: 'miles', header: 'Miles' },
  { accessorKey: 'gallons', header: 'Gallons' },
];

export const reportColumns: ColumnDef<IFTAReport>[] = [
  { accessorKey: 'quarter', header: 'Quarter' },
  { accessorKey: 'year', header: 'Year' },
  { accessorKey: 'totalMiles', header: 'Total Miles' },
  { accessorKey: 'totalGallons', header: 'Total Gallons' },
  { accessorKey: 'avgMpg', header: 'Avg MPG' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            status === 'Filed'
              ? 'bg-green-100 text-green-800'
              : status === 'Draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </div>
      );
    },
  },
  { accessorKey: 'dueDate', header: 'Due Date' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Button variant="ghost" size="sm">
          {status === 'Filed' ? 'View' : 'Edit'}
        </Button>
      );
    },
  },
];

import { MoreHorizontal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { JSX } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import {
  getVehicleComplianceRecords,
  type VehicleComplianceRecord,
} from '@/lib/fetchers/complianceFetchers';

export interface VehicleComplianceRow extends VehicleComplianceRecord {}
interface VehicleComplianceTableProps {
  orgId: string;
}

export async function VehicleComplianceTable({ orgId }: VehicleComplianceTableProps) {
  if (!orgId) {
    return <p className="text-red-500">Organization not found.</p>;
  }
  const vehicles: VehicleComplianceRow[] = await getVehicleComplianceRecords(orgId);

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-neutral-900">
          <TableRow>
            <TableHead>Unit Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Inspection</TableHead>
            <TableHead>Next Inspection</TableHead>
            <TableHead>Defects</TableHead>
            <TableHead>Registration Expiry</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No vehicles found
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.unit}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      v.status === 'Compliant'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : v.status === 'Warning'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                    }
                  >
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {v.lastInspection ? new Date(v.lastInspection).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {v.nextInspection ? new Date(v.nextInspection).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {v.defects === 'None' ? (
                    <span className="text-muted-foreground">None</span>
                  ) : (
                    <span className="text-red-600">{v.defects}</span>
                  )}
                </TableCell>
                <TableCell>
                  {v.registrationExpiry
                    ? new Date(v.registrationExpiry).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-neutral-900">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Inspection</DropdownMenuItem>
                      <DropdownMenuItem>View Maintenance History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

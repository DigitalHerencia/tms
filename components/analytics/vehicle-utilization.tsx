'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/dispatch';

interface VehicleUtilizationProps {
  timeRange: string;
  vehicleData: Vehicle[]; // Updated prop type to Vehicle[]
}

export function VehicleUtilization({
  timeRange,
  vehicleData,
}: VehicleUtilizationProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Miles by Vehicle
          </h3>
          <ChartContainer
            config={{
              miles: {
                label: 'Miles',
                color: 'hsl(var(--chart-1))',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vehicleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="number" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="miles" fill="var(--color-miles)" name="Miles" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Utilization by Vehicle (%)
          </h3>
          <ChartContainer
            config={{
              utilization: {
                label: 'Utilization',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vehicleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="number" />
                <YAxis domain={[70, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="utilization"
                  fill="var(--color-utilization)"
                  name="Utilization"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      <div className="rounded-md border border-gray-200 bg-black p-4">
        <h3 className="mb-4 text-lg font-bold text-white">
          Vehicle Performance Metrics
        </h3>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-zinc-900/50">
              <TableHead className="text-white">Vehicle #</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-right text-white">Miles</TableHead>
              <TableHead className="text-right text-white">
                Utilization
              </TableHead>
              <TableHead className="text-right text-white">MPG</TableHead>
              <TableHead className="text-right text-white">
                Maintenance Cost
              </TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleData.map(vehicle => (
              <TableRow key={vehicle.id} className="border-b border-gray-200">
                <TableCell className="font-medium text-white">
                  {vehicle.id}
                </TableCell>
                <TableCell className="text-white">{vehicle.type}</TableCell>
                <TableCell className="text-right text-white">
                  {vehicle.currentOdometer !== undefined &&
                  vehicle.currentOdometer !== null
                    ? vehicle.currentOdometer.toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right text-white">
                  {vehicle.lastMaintenanceDate
                    ? vehicle.lastMaintenanceDate.toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right text-white">
                  {typeof vehicle.fuelType === 'string'
                    ? vehicle.fuelType.toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right text-white">
                  {vehicle.nextMaintenanceDate
                    ? `$${vehicle.nextMaintenanceDate.toLocaleString()}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {vehicle.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Maintenance
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

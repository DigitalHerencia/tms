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
import { DriverPerformanceMetrics } from '@/types/analytics';

interface DriverPerformanceProps {
  timeRange: string;
  driverPerformanceMetrics: DriverPerformanceMetrics[]; // Added prop for data
}

export function DriverPerformance({
  driverPerformanceMetrics,
}: DriverPerformanceProps) {
  // Assume driverPerformanceMetrics is an array with one element (per timeframe)
  const drivers = driverPerformanceMetrics[0]?.drivers ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Miles Driven by Driver
          </h3>
          <ChartContainer
            config={{
              miles: {
                label: 'Miles',
                color: '--color-chart-1',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={drivers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="driverName" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="miles" fill="--color-miles" name="Miles" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Safety Score by Driver
          </h3>
          <ChartContainer
            config={{
              safetyScore: {
                label: 'Safety Score',
                color: '--color-chart-2',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={drivers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="driverName" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="safetyScore"
                  fill="--color-safetyScore"
                  name="Safety Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-black text-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-zinc-900/50">
              <th className="px-4 py-2 text-left">Driver</th>
              <th className="px-4 py-2 text-right">Miles</th>
              <th className="px-4 py-2 text-right">Loads</th>
              <th className="px-4 py-2 text-right">On-Time %</th>
              <th className="px-4 py-2 text-right">MPG</th>
              <th className="px-4 py-2 text-right">Safety Score</th>
              {/* Violations column removed as it's not in the type */}
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driverId} className="border-b border-gray-200">
                <td className="px-4 py-2 font-medium">{driver.driverName}</td>
                <td className="px-4 py-2 text-right">
                  {driver.miles.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">{driver.loads}</td>
                <td className="px-4 py-2 text-right">
                  {driver.onTimeDelivery}%
                </td>
                <td className="px-4 py-2 text-right">
                  {driver.fuelEfficiency.toFixed(1)}
                </td>
                <td className="px-4 py-2 text-right">{driver.safetyScore}</td>
                {/* Violations column removed as it's not in the type */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

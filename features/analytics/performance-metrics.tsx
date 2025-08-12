'use client';

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { PerformanceAnalytics } from '@/types/analytics';

interface PerformanceMetricsProps {
  analytics: PerformanceAnalytics;
}

export function PerformanceMetrics({ analytics }: PerformanceMetricsProps) {
  const data = analytics.timeSeriesData;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-md border border-gray-200 bg-black p-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Loads Delivered</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                loads: {
                  label: 'Loads',
                  color: '--color-chart-1',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="loads" stroke="--color-loads" name="Loads" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-md border border-gray-200 bg-black p-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Miles Driven</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                miles: {
                  label: 'Miles',
                  color: '--color-chart-2',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="miles" stroke="--color-miles" name="Miles" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-md border border-gray-200 bg-black">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-white">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium">Total Loads</td>
                <td className="p-2 text-right text-sm">{analytics.totalLoads}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium">Total Miles</td>
                <td className="p-2 text-right text-sm">{analytics.totalMiles.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium">Total Revenue</td>
                <td className="p-2 text-right text-sm">${analytics.totalRevenue.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium">Avg Revenue/Mile</td>
                <td className="p-2 text-right text-sm">${analytics.averageRevenuePerMile.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-sm font-medium">On-Time Delivery Rate</td>
                <td className="p-2 text-right text-sm">{analytics.onTimeDeliveryRate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="p-2 text-sm font-medium">Fleet Utilization</td>
                <td className="p-2 text-right text-sm">{analytics.utilizationRate.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

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

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { PerformanceDataPoint } from '@/types/analytics';

interface PerformanceMetricsProps {
  performanceData: PerformanceDataPoint[];
}
/**
 * Client chart component for performance trends over time.
 *
 * @param props.performanceData - Metrics for loads, miles, and more.
 *
 * Charts resize responsively using Recharts containers.
 */

/**
 * Visualize performance metrics such as loads delivered and miles driven.
 *
 * Charts resize automatically using ResponsiveContainer to maintain clarity on
 * any screen size.
 *
 * @param performanceData - Array of revenue and load metrics
 */

export function PerformanceMetrics({ performanceData }: PerformanceMetricsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">Loads Delivered</h3>
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
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="loads" stroke="--color-loads" name="Loads" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">Miles Driven</h3>
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
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="miles" stroke="--color-miles" name="Miles" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">On-Time Delivery (%)</h3>
          <ChartContainer
            config={{
              onTimeDelivery: {
                label: 'On-Time Delivery',
                color: '--color-chart-3',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTimeDelivery"
                  stroke="--color-onTimeDelivery"
                  name="On-Time Delivery"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-4 text-lg font-bold text-card-foreground">Fleet Utilization (%)</h3>
          <ChartContainer
            config={{
              utilization: {
                label: 'Utilization',
                color: '--color-chart-3',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="--color-utilization"
                  name="Utilization"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card text-card-foreground">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-2 text-left text-sm font-medium">Metric</th>
              <th className="p-2 text-right text-sm font-medium">Current Period</th>
              <th className="p-2 text-right text-sm font-medium">Previous Period</th>
              <th className="p-2 text-right text-sm font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-sm font-medium">Total Loads</td>
              <td className="p-2 text-right text-sm">209</td>
              <td className="p-2 text-right text-sm">195</td>
              <td className="p-2 text-right text-sm text-success">+7.2%</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 text-sm font-medium">Total Miles</td>
              <td className="p-2 text-right text-sm">62,350</td>
              <td className="p-2 text-right text-sm">58,450</td>
              <td className="p-2 text-right text-sm text-success">+6.7%</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 text-sm font-medium">Average Load Distance</td>
              <td className="p-2 text-right text-sm">298 mi</td>
              <td className="p-2 text-right text-sm">300 mi</td>
              <td className="p-2 text-right text-sm text-destructive">-0.7%</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 text-sm font-medium">On-Time Delivery Rate</td>
              <td className="p-2 text-right text-sm">94.2%</td>
              <td className="p-2 text-right text-sm">92.5%</td>
              <td className="p-2 text-right text-sm text-success">+1.8%</td>
            </tr>
            <tr>
              <td className="p-2 text-sm font-medium">Fleet Utilization</td>
              <td className="p-2 text-right text-sm">87.8%</td>
              <td className="p-2 text-right text-sm">85.2%</td>
              <td className="p-2 text-right text-sm text-success">+3.1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

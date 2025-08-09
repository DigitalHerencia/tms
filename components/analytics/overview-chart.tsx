'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface OverviewChartProps {
  loads: number;
  drivers: number;
  vehicles: number;
}

export function OverviewChart({ loads, drivers, vehicles }: OverviewChartProps) {
  const data = [
    { name: 'Loads', count: loads },
    { name: 'Drivers', count: drivers },
    { name: 'Vehicles', count: vehicles },
  ];

  return (
    <ChartContainer
      className="h-64 w-full"
      config={{
        count: {
          label: 'Count',
          color: '--color-chart-1',
        },
      }}
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="--color-count" />
      </BarChart>
    </ChartContainer>
  );
}


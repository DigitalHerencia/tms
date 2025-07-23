'use client';

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ExpenseMetrics, ProfitabilityMetrics } from '@/types/analytics'; // Assuming types are defined in @/types

interface FinancialMetricsProps {
  timeRange: string;
  financialData: ProfitabilityMetrics[]; // Updated prop type to ProfitabilityMetrics
  expenseBreakdown: ExpenseMetrics[]; // Updated prop type to ExpenseMetrics
}

export function FinancialMetrics({
  timeRange,
  financialData,
  expenseBreakdown,
}: FinancialMetricsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gray-200 bg-black p-4">
        <h3 className="mb-4 text-lg font-bold text-white">
          Revenue & Expenses
        </h3>
        <ChartContainer
          config={{
            revenue: {
              label: 'Revenue',
              color: '--color-chart-1',
            },
            expenses: {
              label: 'Expenses',
              color: '--color-chart-2',
            },
            profit: {
              label: 'Profit',
              color: '--color-chart-3',
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={financialData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="--color-revenue"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="--color-expenses"
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="--color-profit"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Expense Breakdown
          </h3>
          <ChartContainer
            config={{
              value: {
                label: 'Amount',
                color: '--color-chart-4',
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseBreakdown}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="--color-value" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="rounded-md border border-gray-200 bg-black p-4">
          <h3 className="mb-4 text-lg font-bold text-white">
            Financial Summary
          </h3>
          <div className="rounded-md border border-gray-200 bg-zinc-900 text-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-zinc-900/50">
                  <th className="p-2 text-left text-sm font-medium">Metric</th>
                  <th className="p-2 text-right text-sm font-medium">
                    Current Period
                  </th>
                  <th className="p-2 text-right text-sm font-medium">
                    Previous Period
                  </th>
                  <th className="p-2 text-right text-sm font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-sm font-medium">Total Revenue</td>
                  <td className="p-2 text-right text-sm">$128,450</td>
                  <td className="p-2 text-right text-sm">$114,750</td>
                  <td className="p-2 text-right text-sm text-green-600">
                    +12.0%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 text-sm font-medium">Total Expenses</td>
                  <td className="p-2 text-right text-sm">$93,892</td>
                  <td className="p-2 text-right text-sm">$85,320</td>
                  <td className="p-2 text-right text-sm text-red-600">
                    +10.0%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 text-sm font-medium">Net Profit</td>
                  <td className="p-2 text-right text-sm">$34,558</td>
                  <td className="p-2 text-right text-sm">$29,430</td>
                  <td className="p-2 text-right text-sm text-green-600">
                    +17.4%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 text-sm font-medium">Profit Margin</td>
                  <td className="p-2 text-right text-sm">26.9%</td>
                  <td className="p-2 text-right text-sm">25.6%</td>
                  <td className="p-2 text-right text-sm text-green-600">
                    +1.3%
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-sm font-medium">Revenue per Mile</td>
                  <td className="p-2 text-right text-sm">$3.02</td>
                  <td className="p-2 text-right text-sm">$2.85</td>
                  <td className="p-2 text-right text-sm text-green-600">
                    +6.0%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

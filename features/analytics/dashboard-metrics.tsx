/**
 * Dashboard Metrics Component
 *
 * Displays key performance indicators and metrics cards
 */

import { DollarSign, Package, Truck, TrendingUp, Users } from 'lucide-react';
import { FC } from 'react';

import { MetricCard } from '@/components/analytics/MetricCard';
import { getDashboardSummary } from '@/lib/fetchers/analyticsFetchers';
import type { DashboardSummary } from '@/types/analytics';

interface DashboardMetricsProps {
  orgId: string;
}

/**
 * Server component displaying key metrics for the dashboard.
 *
 * @param props.orgId - Organization identifier to load metrics.
 *
 * Metric cards wrap from two columns on tablets to four columns on desktop.
 */
// See docs/screenshots/dashboard-metrics-cards.png for layout

/**
 * Display KPI metric cards for the dashboard.
 *
 * Cards are arranged in a responsive grid that adapts from a single column on
 * mobile to multiple columns on larger screens. See analytics-kpi.png
 *
 * @param orgId - Identifier for the organization whose metrics are displayed
 */
const DashboardMetrics: FC<DashboardMetricsProps> = async ({ orgId }) => {
  if (!orgId) {
    return <div className="text-red-500">Organization not found</div>;
  }
  let summary: DashboardSummary;
  try {
    summary = await getDashboardSummary(orgId);
  } catch (e) {
    return <div className="text-red-500">Failed to load metrics</div>;
  }

  const metrics = [
    {
      title: 'Active Vehicles',
      value: summary.activeVehicles.toString(),
      change: '',
      icon: Truck,
    },
    {
      title: 'Active Drivers',
      value: summary.activeDrivers.toString(),
      change: '',
      icon: Users,
    },
    {
      title: 'Active Loads',
      value: summary.totalLoads.toString(),
      change: '',
      icon: Package,
    },
    {
      title: 'Revenue (MTD)',
      value: `$${summary.totalRevenue.toLocaleString()}`,
      change: '',
      icon: DollarSign,
    },
    {
      title: 'Revenue per Mile',
      value: `$${summary.averageRevenuePerMile.toFixed(2)}`,
      change: '',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;

import { MetricCard } from '@/components/analytics/MetricCard';
import { OverviewChart } from '@/components/analytics/overview-chart';
import { getDashboardSummary } from '@/lib/fetchers/analyticsFetchers';

interface AnalyticsOverviewFeatureProps {
  orgId: string;
}

export async function AnalyticsOverviewFeature({ orgId }: AnalyticsOverviewFeatureProps) {
  try {
    const summary = await getDashboardSummary(orgId);

    return (
      <div className="space-y-8">
        <OverviewChart
          loads={summary.totalLoads}
          drivers={summary.activeDrivers}
          vehicles={summary.activeVehicles}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Load Count" value={summary.totalLoads} />
          <MetricCard label="Active Drivers" value={summary.activeDrivers} />
          <MetricCard label="Active Vehicles" value={summary.activeVehicles} />
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Failed to load analytics.</p>;
  }
}


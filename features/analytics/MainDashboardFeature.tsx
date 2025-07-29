import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardSummary } from '@/lib/fetchers/analyticsFetchers';
import type { DashboardSummary } from '@/types/analytics';

interface MainDashboardFeatureProps {
  orgId: string;
}
/**
 * Server component for the main analytics dashboard overview.
 *
 * @param props.orgId - Organization identifier used to load summary data.
 *
 * Cards reflow from single column on mobile to grid on larger screens.
 */
// See docs/screenshots/dashboard-overview.png for spacing

/**
 * Display summary analytics for the organization.
 *
 * The grid of KPI cards is fully responsive, stacking vertically on small
 * screens and expanding to multiple columns on desktop.
 * /* See analytics-kpi.png */
 *
 * @param orgId - Identifier for the organization
 */
export async function MainDashboardFeature({
  orgId,
}: MainDashboardFeatureProps) {
  if (!orgId) {
    return <p className="text-red-500">Organization not found.</p>;
  }

  let summary: DashboardSummary;
  try {
    summary = await getDashboardSummary(orgId);
  } catch (err) {
    return <p className="text-red-500">Failed to load analytics.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">
            {'$' + summary.totalRevenue.toLocaleString()}
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Miles</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">{summary.totalMiles}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Loads</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">{summary.totalLoads}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Drivers</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">{summary.activeDrivers}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">{summary.activeVehicles}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue per Mile</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <span className="text-3xl font-bold">
            {'$' + summary.averageRevenuePerMile.toFixed(2)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

import FleetOverviewHeader from '@/components/dashboard/fleet-overview-header';
import { getDashboardSummary } from '@/lib/fetchers/analyticsFetchers';
import type { DashboardSummary } from '@/types/dashboard';

export default async function FleetOverviewHeaderFeature({ orgId }: { orgId: string }) {
  let summary: DashboardSummary | null = null;
  try {
    const rawSummary = await getDashboardSummary(orgId);
    summary = {
      ...rawSummary,
      totalVehicles: rawSummary.activeVehicles ?? 0,
    };
  } catch {
    summary = null;
  }

  return <FleetOverviewHeader summary={summary} />;
}

import { PerformanceOverviewCard } from '@/components/drivers/performance-card';
import { getDriverAnalytics } from '@/lib/fetchers/analyticsFetchers';

interface PerformanceOverviewProps {
  driverId: string;
  orgId: string;
}

export default async function PerformanceOverview({ driverId, orgId }: PerformanceOverviewProps) {
  try {
    const analytics = await getDriverAnalytics(orgId, '30d', { driverId });
    const data = analytics[0] || null;
    return <PerformanceOverviewCard analytics={data} />;
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    return <PerformanceOverviewCard analytics={null} />;
  }
}

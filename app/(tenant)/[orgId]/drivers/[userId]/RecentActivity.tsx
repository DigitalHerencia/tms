import { RecentActivityCard } from '@/components/drivers/recent-activity-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRecentDispatchActivity } from '@/lib/fetchers/dispatchFetchers';

interface RecentActivityProps {
  driverId: string;
  orgId: string;
}

export default async function RecentActivity({ driverId, orgId }: RecentActivityProps) {
  try {
    const activityResponse = await getRecentDispatchActivity(orgId, 7);
    const activities = activityResponse.success ? activityResponse.data : [];
    const driverActivities = activities
      .filter((activity: any) => activity.driverId === driverId || activity.entityId === driverId)
      .slice(0, 5);
    return <RecentActivityCard activities={driverActivities} />;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">Latest driver actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Unable to load recent activity</p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

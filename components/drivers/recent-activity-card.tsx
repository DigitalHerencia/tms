// features/driver/RecentActivityCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export async function RecentActivityCard({ driverId, orgId }: { driverId: string; orgId: string }) {
  const { getRecentDispatchActivity } = await import('@/lib/fetchers/dispatchFetchers');
  try {
    const activityResponse = await getRecentDispatchActivity(orgId, 7);
    const activities = activityResponse.success ? activityResponse.data : [];
    const driverActivities = activities
      .filter((activity: any) => activity.driverId === driverId || activity.entityId === driverId)
      .slice(0, 5);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Latest driver actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {driverActivities.length > 0 ? (
            <div className="space-y-4">
              {driverActivities.map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{activity.action || 'Activity'}</div>
                    <div className="text-xs text-gray-400">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                    </div>
                    {activity.details && (
                      <div className="text-xs text-gray-300 mt-1">{activity.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No recent activity found</p>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                View Full History
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Latest driver actions and updates
          </CardDescription>
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

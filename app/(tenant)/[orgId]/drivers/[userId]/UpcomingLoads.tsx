import { UpcomingLoadsCard } from '@/components/drivers/upcoming-loads-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLoadsByOrg } from '@/lib/fetchers/dispatchFetchers';

interface UpcomingLoadsProps {
  driverId: string;
  orgId: string;
}

export default async function UpcomingLoads({ driverId, orgId }: UpcomingLoadsProps) {
  try {
    const loads = await getLoadsByOrg(orgId);
    const upcomingLoads = loads
      .filter(
        (load: any) =>
          load.assignedDriverId === driverId &&
          load.status === 'assigned' &&
          new Date(load.pickupDate) > new Date(),
      )
      .sort((a: any, b: any) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime())
      .slice(0, 3);
    return <UpcomingLoadsCard upcomingLoads={upcomingLoads} />;
  } catch (error) {
    console.error('Error fetching upcoming loads:', error);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Upcoming Loads</CardTitle>
          <CardDescription className="text-gray-400">Next scheduled assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Unable to load upcoming assignments</p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

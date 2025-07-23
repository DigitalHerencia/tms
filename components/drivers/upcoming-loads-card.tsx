// features/driver/UpcomingLoadsCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLoadsByOrg } from '@/lib/fetchers/dispatchFetchers'
export async function UpcomingLoadsCard({ driverId, orgId }: { driverId: string; orgId: string }) {
  try {
    const loadResponse = await getLoadsByOrg(orgId);
    const loads = loadResponse
    const upcomingLoads = loads
      .filter((load: any) =>
        load.assignedDriverId === driverId &&
        load.status === 'assigned' &&
        new Date(load.pickupDate) > new Date()
      )
      .sort((a: any, b: any) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime())
      .slice(0, 3);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Upcoming Loads</CardTitle>
          <CardDescription className="text-gray-400">Next scheduled assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingLoads.length > 0 ? (
            <div className="space-y-4">
              {upcomingLoads.map((load: any) => (
                <div key={load.id} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Load #{load.loadId || load.id}</span>
                    <span className="text-xs text-gray-400">{new Date(load.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Origin: <span className="text-white">{load.origin}</span></div>
                    <div>Destination: <span className="text-white">{load.destination}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No upcoming loads scheduled</p>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">View Load Board</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">Refresh</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

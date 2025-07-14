// features/driver/CurrentLoadCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Calendar } from 'lucide-react';

export function CurrentLoadCard({ assignment }: { assignment: any }) {
  const hasAssignment = assignment && typeof assignment === 'object';
  const loadData = hasAssignment ? assignment : null;
  
  return (
    <Card className="bg-black/40 border-gray-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-400" />
            Current Load
          </CardTitle>
          {hasAssignment && (
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              Active
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-400">
          {hasAssignment ? 'Currently assigned load details' : 'No active load assignment'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasAssignment ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Load ID</p>
                <p className="font-semibold text-white">{loadData.loadId || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Priority</p>
                <Badge variant="outline" className={
                  loadData.priority === 'high' ? 'border-red-200 bg-red-50 text-red-700' :
                  loadData.priority === 'medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                  'border-green-200 bg-green-50 text-green-700'
                }>
                  {loadData.priority ? loadData.priority.charAt(0).toUpperCase() + loadData.priority.slice(1) : 'Normal'}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Origin</p>
                <p className="font-semibold text-white">{loadData.origin || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Destination</p>
                <p className="font-semibold text-white">{loadData.destination || ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Vehicle</p>
                <p className="font-semibold text-white">{loadData.vehicleId || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Trailer</p>
                <p className="font-semibold text-white">{loadData.trailerId || ''}</p>
              </div>
            </div>
            {loadData.pickupDate && (
              <div>
                <p className="text-sm text-gray-400">Pickup Date</p>
                <p className="font-semibold text-white">{new Date(loadData.pickupDate).toLocaleDateString()}</p>
              </div>
            )}
            {loadData.deliveryDate && (
              <div>
                <p className="text-sm text-gray-400">Delivery Date</p>
                <p className="font-semibold text-white">{new Date(loadData.deliveryDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No active load assignment</p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">View Available Loads</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

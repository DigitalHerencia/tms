// features/driver/PerformanceOverviewCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PerformanceOverviewCard({ analytics }: { analytics: any }) {
  const performanceData = analytics || null;
  return (
    <Card className="bg-black/40 border-gray-800/50">
      <CardHeader>
        <CardTitle className="text-lg text-white">Performance Overview</CardTitle>
        <CardDescription className="text-gray-400">Last 30 days performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {performanceData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {performanceData.totalLoads || performanceData.loadsCompleted || 0}
              </div>
              <div className="text-sm text-gray-400">Loads Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {performanceData.totalRevenue ?
                  `$${performanceData.totalRevenue.toLocaleString()}` :
                  performanceData.revenue ?
                  `$${performanceData.revenue.toLocaleString()}` : '$0'}
              </div>
              <div className="text-sm text-gray-400">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {performanceData.totalMiles ?
                  performanceData.totalMiles.toLocaleString() :
                  performanceData.miles ?
                  performanceData.miles.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-gray-400">Miles Driven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {performanceData.onTimeDeliveryRate ?
                  `${Math.round(performanceData.onTimeDeliveryRate * 100)}%` :
                  performanceData.onTimeRate ?
                  `${Math.round(performanceData.onTimeRate * 100)}%` : '0%'}
              </div>
              <div className="text-sm text-gray-400">On-Time Rate</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No performance data available</p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">View Detailed Analytics</Button>
          </div>
        )}
        {performanceData && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Safety Score:</span>
                <span className="text-white font-semibold">
                  {performanceData.safetyScore ?
                    `${performanceData.safetyScore}/100` :
                    'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fuel Efficiency:</span>
                <span className="text-white font-semibold">
                  {performanceData.fuelEfficiency ?
                    `${performanceData.fuelEfficiency} MPG` :
                    'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Rating:</span>
                <span className="text-white font-semibold">
                  {performanceData.averageRating ?
                    `${performanceData.averageRating}/5.0` :
                    'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">HOS Violations:</span>
                <span className={`font-semibold ${
                  (performanceData.hosViolations || 0) > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {performanceData.hosViolations || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

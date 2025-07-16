import { Suspense } from 'react';
import { Activity, Users, Truck, AlertTriangle, TrendingUp, Calendar, BarChart } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrganizationStats } from '@/components/admin/OrganizationStats';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export function AdminOverview({ orgId }: { orgId: string }) {
  return (
      <div className="space-y-6">
        
      {/* Recent Activity Summary */}
      <Card className="border border-gray-200 bg-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            Today's Summary
          </CardTitle>
          <CardDescription className="text-gray-400">
            Key metrics and activities for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">New Users</p>
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-xs text-green-500">+25% vs yesterday</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Loads Created</p>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-blue-500">+8% vs yesterday</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">System Events</p>
              <p className="text-2xl font-bold text-white">48</p>
              <p className="text-xs text-gray-400">Normal activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Organization Statistics */}
      <Suspense fallback={<LoadingSpinner />}>
        <OrganizationStats orgId={orgId} />
      </Suspense>
      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 bg-black hover:bg-neutral-900 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Online</div>
            <p className="text-xs text-green-500">All services operational</p>
            <Badge variant="outline" className="mt-2 border-green-200 bg-green-50 text-green-700">
              Healthy
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-black hover:bg-neutral-900 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-blue-500">+12% from yesterday</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">Trending up</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-black hover:bg-neutral-900 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Fleet Activity</CardTitle>
            <Truck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85%</div>
            <p className="text-xs text-yellow-500">Fleet utilization</p>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-black hover:bg-neutral-900 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-red-500">Require attention</p>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              View All
            </Button>
          </CardContent>
        </Card>
      </div>


      
    </div>
  );
}

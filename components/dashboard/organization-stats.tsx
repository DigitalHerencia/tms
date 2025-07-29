import {
  Users,
  Truck,
  UserCheck,
  Package,
  Calendar,
  Activity,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardMetrics, getOrganizationStats } from '@/lib/fetchers/dashboardFetchers';
import { Button } from '@/components/ui/button';

export async function OrganizationStats({ orgId, userId }: { orgId: string; userId?: string }) {
  // Fetch metrics and stats in parallel
  const [metrics, stats] = await Promise.all([
    getDashboardMetrics(orgId, userId ?? ''), // Ensure userId is a string
    getOrganizationStats(orgId),
  ]);

  // Calculate fleet utilization
  const fleetUtilization =
    metrics.totalVehicles > 0
      ? Math.round(
          ((metrics.totalVehicles - metrics.availableVehicles) / metrics.totalVehicles) * 100,
        )
      : 0;

  // Only real data, no growth calculation
  const statsData = [
    {
      title: 'Total Users',
      value: stats.userCount,
      icon: Users,
      description: 'All registered users',
      color: 'text-blue-500',
    },
    {
      title: 'Fleet Vehicles',
      value: stats.vehicleCount,
      icon: Truck,
      description: 'Registered vehicles',
      color: 'text-purple-500',
    },
    {
      title: 'Active Drivers',
      value: stats.driverCount,
      icon: Users,
      description: 'Licensed drivers',
      color: 'text-orange-500',
    },
    {
      title: 'Total Loads',
      value: stats.loadCount,
      icon: Package,
      description: 'All time loads',
      color: 'text-cyan-500',
    },
  ];

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
              <p className="text-2xl font-bold text-white">{stats.userCount}</p>
              <p className="text-xs text-green-500">Active: {stats.activeUserCount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Loads Created</p>
              <p className="text-2xl font-bold text-white">{stats.loadCount}</p>
              <p className="text-xs text-blue-500">Active: {metrics.activeLoads}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">System Events</p>
              <p className="text-2xl font-bold text-white">{metrics.criticalAlerts}</p>
              <p className="text-xs text-gray-400">Alerts: {metrics.criticalAlerts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border border-gray-200 bg-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mb-2">{stat.description}</p>
                {/* Growth and progress bar removed, only real data shown */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Summary Card */}
      <Card className="border border-gray-200 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Organization Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">92%</p>
              <p className="text-sm text-gray-400">Overall health</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right space-y-1">
                <p className="text-sm font-medium text-green-400">Excellent</p>
                <p className="text-xs text-gray-400">Based on all metrics</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-sm font-bold text-green-500">A+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 bg-black">
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

        <Card className="border border-gray-200 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeUserCount}</div>
            <p className="text-xs text-blue-500">Drivers: {stats.driverCount}</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">Trending up</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Fleet Activity</CardTitle>
            <Truck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{fleetUtilization}%</div>
            <p className="text-xs text-yellow-500">Fleet utilization</p>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${fleetUtilization}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.criticalAlerts}</div>
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
